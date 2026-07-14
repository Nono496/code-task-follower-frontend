import { NgStyle } from '@angular/common';
import { Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from "primeng/autofocus";
import { Button } from "primeng/button";
import { Chip } from "primeng/chip";
import { ColorPicker } from "primeng/colorpicker";
import { Dialog } from "primeng/dialog";
import { Fieldset } from "primeng/fieldset";
import { Inplace } from "primeng/inplace";
import { Project, State, stateSchema } from '../../../dtos/zod-schemas';
import { StateService } from '../../../services/state-service';
import { FormService } from '../../../services/form-service';
import z from 'zod';
import { ProjectService } from '../../../services/project-service';

@Component({
  selector: 'app-kanban-settings-component',
  imports: [Dialog, Fieldset, Inplace, Chip, NgStyle, ColorPicker, Button, AutoFocus, FormsModule],
  templateUrl: './kanban-settings-component.html',
  styleUrl: './kanban-settings-component.css',
})
export class KanbanSettingsComponent {
  formService = inject(FormService);
  stateService = inject(StateService);
  projectService = inject(ProjectService);

  project = model.required<Project>();
  visible = model.required<boolean>();

  initialStateToCreate: State = {
    color: '#0000FF'
  } as State;

  stateToCreate = signal<State>({...this.initialStateToCreate});
  otherStates = this.stateService.getAll();

  onChangeSettings = input<() => void>();

  /*onDelete(name: string, value: any, closeCallback: () => any) {
    switch (name) {
      case 'state':
        this.stateService.delete(value.id).subscribe({
          next: () => closeCallback(),
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 })
        });
        break;
    
      default:
        break;
    }
  }*/

  addStateToProject(state: State) {
    this.formService.asyncOperation(
      this.projectService.addStateToProject(this.project().id!, state.id!),
      () => {
        this.project.update(p => {
          p.states = p.states?.length ? p.states : [];
          p.states.push(state);
          return p;
        });
        this.stateToCreate.set({...this.initialStateToCreate});
      }
    );
  }

  onSubmit(name: string, value: any, closeCallback?: () => any) {
    switch (name) {        
      case 'stateToAdd':
        this.addStateToProject(value);
        break;

      case 'stateToRemove':
        this.formService.asyncOperation(
          this.projectService.removeFromProject(this.project().id!, value.id),
          () => {
            this.project.update((p) => {
              p.states = p.states?.filter(s => s.id !== value.id);
              return p;
            });
            closeCallback!();
          }
        );
        break;
      
      case 'state':
        const validation = this.formService.validateSchema(stateSchema, value);
        if (!validation.success) {
          this.formService.saveErrorMessage('Invalid data', z.prettifyError(validation.error), 5000);
          return;
        }
      
        if (value.id) {
          this.formService.asyncOperation(
            this.stateService.edit(value),
            () => closeCallback!()
          );
        } else {
          this.formService.startSaveMessage();
          this.stateService.create(value).subscribe({
            next: (stateId) => {
              closeCallback!();
              this.addStateToProject({ ...value, id: stateId });
            }
          });
        }
        break;
    
      default:
        break;
    }
  }
}
