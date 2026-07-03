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
import { ZodService } from '../../../services/zod-service';

@Component({
  selector: 'app-kanban-settings-component',
  imports: [Dialog, Fieldset, Inplace, Chip, NgStyle, ColorPicker, Button, AutoFocus, FormsModule, Toast],
  templateUrl: './kanban-settings-component.html',
  styleUrl: './kanban-settings-component.css',
})
export class KanbanSettingsComponent {
  messageService = inject(MessageService);
  zodService = inject(ZodService);
  stateService = inject(StateService);

  project = model.required<Project>();
  visible = model.required<boolean>();

  stateToAdd = signal<State>({} as State);

  onDelete(name: string, value: any, closeCallback: () => any) {
    switch (name) {
      case 'state':
        this.stateService.delete(value.id).subscribe(deleted => {
          if (deleted) {
            closeCallback()
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
          }
        });
        break;
    
      default:
        break;
    }
  }

  onSubmit(name: string, value: any, closeCallback: () => any) {
    switch (name) {
      case 'stateToAdd':
        if (!this.zodService.validateSchema(stateSchema, value).success) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect data', life: 3000 });
          return;
        }

        this.stateService.create(value).subscribe(stateId => {
          if (!stateId) {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
            return;
          }

          this.project.update(p => {
            p.states?.push({...value, id: stateId});
            return p;
          });
          this.stateToAdd.set({} as State);
        });
        break;

      case 'state':
        if (!this.zodService.validateProp(stateSchema, name, value).success) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect data', life: 3000 });
          return;
        }
      
        this.stateService.edit(value).subscribe(ok => {
          if (ok) {
            closeCallback();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
          }
        });
        break;
    
      default:
        break;
    }
  }
}
