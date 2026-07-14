import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { JsonPipe, NgStyle } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Project, projectSchema, Task } from '../../dtos/zod-schemas';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from "primeng/card";
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { FormService } from '../../services/form-service';
import { ProjectService } from '../../services/project-service';
import { StateService } from '../../services/state-service';
import { TaskService } from '../../services/task-service';
import { TaskComponent } from "../task/task-component";
import { KanbanSettingsComponent } from "./kanban-settings-component/kanban-settings-component";
import { RouteItems } from '../../app.routes';
import { TagService } from '../../services/tag-service';

@Component({
  selector: 'app-project',
  imports: [NgStyle, DialogModule, CdkDrag, Skeleton, CdkDropList, InplaceModule, ButtonModule, InputTextModule, ColorPickerModule, FormsModule, AutoFocusModule, ListboxModule, CardModule, DividerModule, TaskComponent, KanbanSettingsComponent],
  templateUrl: './project-component.html',
  styleUrl: './project-component.css',
})
export class ProjectComponent {
  formService = inject(FormService);
  router = inject(Router);

  projectService = inject(ProjectService);
  stateService = inject(StateService);
  taskService = inject(TaskService);

  projectId = input<number | null | undefined>();
  project = this.projectService.get(this.projectId,
  {
    color: '#00FF00'
  } as Project);

  tags = inject(TagService).getAll();
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
  onCreateTask(task: Task) {
    this.project.update(p => {
      p!.tasks = !p?.tasks ? [] : [...p?.tasks];
      p!.tasks.push(task);
      return {...p!};
    });
  }
  onDeleteTask(task: Task) {
    this.project.update(p => {
      p!.tasks = [...p!.tasks!.filter(t => t.id !== task.id)];
      return {...p!};
    });
  }
  
  constructor() {
    effect(() => {
      if(!this.isEditingTask()) {
        this.editedTaskId.set(0);
        this.editedTaskId.set(null);
      }
    });
  }

  isInKanbanSettings = signal<boolean>(false);
  onEditKanbanSettings() {
    this.project.reload();
  }

  onSubmit(name: string, value: any) {
    if (this.project.value()!.id) {
      if (!this.formService.validateProp(projectSchema, name, value).success) {
        this.formService.saveErrorMessage();
        return;
      }

      this.formService.asyncOperation(
        this.projectService.patch(this.project.value()!.id!, this.formService.getPart(name, value))
      );
    } else {
      // Validation
      if (!this.formService.validateSchema(projectSchema, this.project.value()).success) {
        this.formService.saveErrorMessage();
        return;
      }

      // Create
      this.formService.asyncOperation(
        this.projectService.create(this.project.value()!),
        id => {
          this.project.update(p => {
            p!.id = id;
            return p;
          });
        }
      );
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container && this.project.hasValue()) {
      const movedTask = this.project.value().tasks!.filter(t => t.id == event.item.data).at(0)!;
      const state = this.project.value().states!.filter(s => s.id + ' ' + s.name === event.container.id).at(0)!;

      this.formService.startSaveMessage();
      this.project.update(p => {
        p!.tasks!.filter(t => t.id == event.item.data).at(0)!.stateId = state.id!;
        return p;
      });
      this.taskService.updateTaskState(movedTask.id!, state.id!).subscribe({
        next: () => {
          this.formService.endSaveMessage();
        },
        error: () => {
          this.formService.saveErrorMessage();
          this.project.reload();
        }
      });
    }
  }

  delete(event: Event) {
    this.formService.confirmDelete(event, () => {
      this.formService.startSaveMessage('Project is being deleted...');
      
      this.projectService.delete(this.project.value()?.id!).subscribe({
      next: () => {
          this.formService.endSaveMessage('Project has been deleted');
          this.router.navigate(['/', RouteItems.Dashboard]);
      },

      error: () => this.formService.saveErrorMessage('Project could not be deleted.')
      });
  });
  }
}
