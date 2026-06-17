import { NgStyle } from '@angular/common';
import { Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from "primeng/autofocus";
import { Button } from "primeng/button";
import { Chip } from "primeng/chip";
import { ColorPicker } from "primeng/colorpicker";
import { Dialog } from "primeng/dialog";
import { Fieldset } from "primeng/fieldset";
import { Inplace } from "primeng/inplace";
import { Project, State } from '../../../dtos/project';

@Component({
  selector: 'app-kanban-settings-component',
  imports: [Dialog, Fieldset, Inplace, Chip, NgStyle, ColorPicker, Button, AutoFocus, FormsModule],
  templateUrl: './kanban-settings-component.html',
  styleUrl: './kanban-settings-component.css',
})
export class KanbanSettingsComponent {
  project = input.required<Project>();
  visible = model.required<boolean>();

  stateToAdd = signal<State>({} as State);

  onSubmit(name: string, value: any) {
    // TODO
    console.log(name + ":");
    console.table(value)
  }
}
