import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, signal } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Project, Task } from '../../dtos/project';

import { FormsModule } from '@angular/forms';
import { CardModule } from "primeng/card";
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { ProjectService } from '../../services/project-service';
import { StateService } from '../../services/state-service';
import { TaskService } from '../../services/task-service';
import { TaskComponent } from "../task/task-component";
import { KanbanSettingsComponent } from "./kanban-settings-component/kanban-settings-component";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project',
  imports: [NgStyle, DialogModule, CdkDrag, Skeleton, CdkDropList, InplaceModule, ButtonModule, InputTextModule, ColorPickerModule, FormsModule, AutoFocusModule, ListboxModule, CardModule, DividerModule, TaskComponent, KanbanSettingsComponent],
  templateUrl: './project-component.html',
  styleUrl: './project-component.css',
})
export class ProjectComponent {
  projectService = inject(ProjectService);
  stateService = inject(StateService);
  taskService = inject(TaskService);

  messageService = inject(MessageService);

  projectId = input<number | undefined>();
  project = this.projectService.get(this.projectId);
  
  ngOnInit() {
    if (!this.projectId()) {
      this.project.set(({
        color: '#00FF00',
        states: [],
        tasks: [],
        branches: []
      } as Project));
    }
  }

  isEditingTask = signal<boolean>(false);
  editedTaskId = signal<number | null>(null);
  editedTask = computed<Task>(() => {
    if (this.editedTaskId() === null) return {} as Task;
    return this.project.value()!.tasks?.filter(t => t.id == this.editedTaskId()).at(0)!;
  });
  editTask(taskId: number | null) {
    this.editedTaskId.set(taskId);
    this.isEditingTask.set(true);
  }
  onCreateTask() {
    this.project.update(p => {
      p?.tasks.push(this.editedTask());
      return p;
    })
  }
  
  isInKanbanSettings = signal<boolean>(false);
  
  onSubmit(name: string, value: any) {
    this.projectService.edit(this.project.value()!).subscribe(ok => {
      if (!ok) {
        this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
      }
    })
  }
  
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container && this.project.hasValue()) {
      const movedTask = this.project.value().tasks.filter(t => t.id == event.item.data).at(0)!;
      movedTask.state = this.project.value().states.filter(s => s.id + ' ' + s.name === event.container.id).at(0)!;
      
      this.taskService.edit(movedTask).subscribe((ok) => {
        if (ok) {
          this.project.update(p => {
            p!.tasks.filter(t => t.id == event.item.data).at(0)!.state = movedTask.state;
            return p;
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
        }
      });
    }
  }
}
