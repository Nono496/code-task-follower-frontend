import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Project, State, Task } from '../../dtos/project';

import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { CardModule } from "primeng/card";
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TaskComponent } from "../task/task-component";

@Component({
  selector: 'app-project',
  imports: [NgStyle, DialogModule, CdkDrag, CdkDropList, InplaceModule, ButtonModule, InputTextModule, ColorPickerModule, FormsModule, AutoFocusModule, ListboxModule, CardModule, DividerModule, RouterLink, TaskComponent],
  templateUrl: './project-component.html',
  styleUrl: './project-component.css',
})
export class ProjectComponent {
  project = model.required<Project>();
  states = input.required<State[]>();

  isEditingTask = signal<boolean>(false);
  editedTaskId = signal<number | null>(null);
  editedTask = computed<Task>(() => {
    if (this.editedTaskId() === null) return {} as Task;
    return this.project().tasks.filter(t => t.id == this.editedTaskId()).at(0)!;
  });
  editTask(taskId: number | null) {
    
    this.editedTaskId.set(taskId);
    this.isEditingTask.set(true);
  }

  ngOnInit() {
    if (!this.project().color) this.project().color = '#00FF00';
  }
  
  onSubmit(name: string, value: any) {
    // TODO
    console.log(name + ": " + value)
  }
  
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      this.project.update(p => {
        p.tasks.filter(t => t.id == event.item.data).at(0)!.state = this.states().filter(s => s.id + ' ' + s.name === event.container.id).at(0)!;

        return p;
      });
    }
  }
}
