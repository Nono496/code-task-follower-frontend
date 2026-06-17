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
import { Project, State } from '../../../dtos/project';
import { StateService } from '../../../services/state-service';

@Component({
  selector: 'app-kanban-settings-component',
  imports: [Dialog, Fieldset, Inplace, Chip, NgStyle, ColorPicker, Button, AutoFocus, FormsModule],
  templateUrl: './kanban-settings-component.html',
  styleUrl: './kanban-settings-component.css',
})
export class KanbanSettingsComponent {
  stateService = inject(StateService);

  project = model.required<Project>();
  visible = model.required<boolean>();

  stateToAdd = signal<State>({} as State);

  onSubmit(name: string, value: any) {
    switch (name) {
      case 'stateToAdd':
        this.stateService.create(this.stateToAdd()).subscribe(state => {
          if (!state) return;

          this.project.update(p => {
            p.states?.push({...this.stateToAdd(), id: state.id});
            return p;
          });
          this.stateToAdd.set({} as State);
        })
        break;
    
      default:
        break;
    }
  }
}
