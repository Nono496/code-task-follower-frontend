import { NgStyle } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoFocus } from "primeng/autofocus";
import { Button } from "primeng/button";
import { Chip } from "primeng/chip";
import { ColorPicker } from "primeng/colorpicker";
import { Dialog } from "primeng/dialog";
import { Fieldset } from "primeng/fieldset";
import { Inplace } from "primeng/inplace";
import { Toast } from "primeng/toast";
import { Project, State, stateSchema } from '../../../dtos/zod-schemas';
import { StateService } from '../../../services/state-service';
import { FormService } from '../../../services/form-service';
import z from 'zod';
import { ProjectService } from '../../../services/project-service';

@Component({
  selector: 'app-kanban-settings-component',
  imports: [Dialog, Fieldset, Inplace, Chip, NgStyle, ColorPicker, Button, AutoFocus, FormsModule, Toast],
  templateUrl: './kanban-settings-component.html',
  styleUrl: './kanban-settings-component.css',
})
export class KanbanSettingsComponent {
  messageService = inject(MessageService);
  formService = inject(FormService);
  stateService = inject(StateService);
  projectService = inject(ProjectService);

  project = model.required<Project>();
  visible = model.required<boolean>();

  stateToCreate = signal<State>({} as State);
  otherStates = this.stateService.getAll();

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

  addState(state: State) {
    this.formService.startSaveMessage();
    this.projectService.addToProject(this.project().id!, state.id!).subscribe({
      next: () => {
        this.project.update(p => {
          p.states = p.states?.length ? p.states : [];
          p.states.push(state);
          return p;
        });
        this.stateToCreate.set({} as State);
        this.formService.endSaveMessage();
      },
      error: () => this.formService.saveErrorMessage()
    });
  }

  onSubmit(name: string, value: any, closeCallback?: () => any) {
    switch (name) {        
      case 'stateToAdd':
        this.addState(value);
        break;

      case 'stateToRemove':        
        this.formService.startSaveMessage();
        this.projectService.removeFromProject(this.project().id!, value.id).subscribe({
          next: () => {
            this.project.update((p) => {
              p.states = p.states?.filter(s => s.id !== value.id);
              return p;
            });
            this.formService.endSaveMessage();
            closeCallback!();
          },
          error: () => this.formService.saveErrorMessage()
        });
        break;
      
      case 'state':
        const validation = this.formService.validateSchema(stateSchema, value);
        if (!validation.success) {
          this.formService.saveErrorMessage('Invalid data', z.prettifyError(validation.error), 5000);
          return;
        }
      
        this.formService.startSaveMessage();
        if (value.id) {
          this.stateService.edit(value).subscribe({
            next: () => {
              closeCallback!();
              this.formService.endSaveMessage();
            },
            error: () => this.formService.saveErrorMessage()
          });
        } else {
          this.stateService.create(value).subscribe({
            next: (stateId) => {
              closeCallback!();
              this.addState({ ...value, id: stateId });
            },
            error: () => this.formService.saveErrorMessage()
          });
        }
        break;
    
      default:
        break;
    }
  }
}
