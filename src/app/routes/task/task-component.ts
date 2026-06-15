import { Component, effect, inject, input, model, signal } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { Project, State, Tag, Task } from '../../dtos/project';
import { Inplace } from "primeng/inplace";
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { ChipModule } from 'primeng/chip';
import { NgStyle } from '@angular/common';
import { Button } from "primeng/button";
import { SelectModule } from "primeng/select";
import { TaskService } from '../../services/task-service';
import { ColorPicker } from "primeng/colorpicker";
import { MultiSelectModule } from 'primeng/multiselect';
import { ProjectService } from '../../services/project-service';

@Component({
  selector: 'app-task-component',
  imports: [Dialog, Inplace, FormsModule, SelectModule, MultiSelectModule, AutoFocusModule, ChipModule, NgStyle, Button, ColorPicker],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
  task = input.required<Task>();
  visible = model.required<boolean>();

  states = input<State[]>(inject(TaskService).getStates(), {transform: (value): State[] => {
    if (value === undefined) return inject(TaskService).getStates();
    return value as State[];
  }});

  projects = input<Project[]>(inject(ProjectService).getProjects(), {transform: (value): Project[] => {
    if (value === undefined) return inject(ProjectService).getProjects();
    return value as Project[];
  }});

  otherTasks = input<Task[]>(inject(TaskService).getTasks(), {transform: (value): Task[] => {
    if (value === undefined) return inject(TaskService).getTasks();
    return value as Task[];
  }});

  tagToAdd = signal<Tag>({} as Tag);

  ngOnInit() {
    if (this.task().state === undefined) this.task().state = this.states()?.at(0)!;
  }

  onSubmit(name: string, value: any) {
    // TODO
    console.log(name + ":");
    console.table(value)
  }
}
