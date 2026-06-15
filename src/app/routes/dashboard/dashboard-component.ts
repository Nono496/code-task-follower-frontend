import { NgStyle } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { ButtonIcon, ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { Project, Task } from '../../dtos/project';
import { RouterLink } from "@angular/router";
import { TaskComponent } from "../task/task-component";

@Component({
  selector: 'app-dashboard',
  imports: [DataViewModule, TagModule, CardModule, NgStyle, DividerModule, ButtonModule, ButtonIcon, RouterLink, TaskComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class Dashboard {
  projects = input.required<Project[]>();
  tasks = input.required<Task[]>();

  isEditingTask = signal<boolean>(false);
  editedTaskId = signal<number | null>(null);
  editedTask = computed<Task>(() => {
    if (this.editedTaskId() === null) return {} as Task;
    return this.tasks().filter(t => t.id == this.editedTaskId()).at(0)!;
  });
  editTask(taskId: number | null) {
    
    this.editedTaskId.set(taskId);
    this.isEditingTask.set(true);
  }
}
