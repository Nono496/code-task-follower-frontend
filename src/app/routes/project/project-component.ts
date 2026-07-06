import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { JsonPipe, NgStyle } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, signal } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { Project, projectSchema, Task } from '../../dtos/zod-schemas';

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
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { FormService as FormService } from '../../services/form-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouteItems } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [NgStyle, DialogModule, CdkDrag, Skeleton, CdkDropList, InplaceModule, ButtonModule, InputTextModule, ColorPickerModule, FormsModule, AutoFocusModule, ListboxModule, CardModule, DividerModule, TaskComponent, KanbanSettingsComponent, Toast, ConfirmDialogModule, JsonPipe ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './project-component.html',
  styleUrl: './project-component.css',
})
export class ProjectComponent {
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  formService = inject(FormService);
  router = inject(Router);

  projectService = inject(ProjectService);
  stateService = inject(StateService);
  taskService = inject(TaskService);

  projectId = input<number | null | undefined>();
  project = this.projectService.get(this.projectId,
    projectSchema.parse({
      name: 'Unnamed project',
      color: '#00FF00'
    } as Project));

  ngOnInit() {
    this.formService.messageService = this.messageService;
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
      p!.tasks = !p?.tasks ? [] : p?.tasks;
      p!.tasks.push(this.editedTask());
      return p;
    })
  }

  isInKanbanSettings = signal<boolean>(false);

  onSubmit(name: string, value: any) {
    if (this.project.value()?.id) {
      if (!this.formService.validateProp(projectSchema, name, value).success) {
        this.formService.saveErrorMessage();
        return;
      }

      this.projectService.edit(this.project.value()!).subscribe({
        error: () => this.formService.saveErrorMessage()
      });
    } else {
      // Validation
      if (!this.formService.validateSchema(projectSchema, this.project.value()).success) {
        console.error(this.formService.validateSchema(projectSchema, this.project.value()).data)
        console.error(this.formService.validateSchema(projectSchema, this.project.value()).error)
        this.formService.saveErrorMessage();
        return;
      }

      // Create
      this.formService.startSaveMessage();
      this.projectService.create(this.project.value()!).subscribe({
        next: id => {
          this.project.update(p => {
            p!.id = id;
            return p;
          });
          this.formService.endSaveMessage();
        },
        error: () => this.formService.saveErrorMessage()
      });
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container && this.project.hasValue()) {
      const movedTask = this.project.value().tasks!.filter(t => t.id == event.item.data).at(0)!;
      const state = this.project.value().states!.filter(s => s.id + ' ' + s.name === event.container.id).at(0)!;

      this.taskService.updateTaskState(movedTask.id!, state.id!).subscribe({
        next: () => this.project.update(p => {
          p!.tasks!.filter(t => t.id == event.item.data).at(0)!.state = state;
          return p;
        }),
        error: () => this.formService.saveErrorMessage()
      });
    }
  }

  delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.formService.startSaveMessage('Project is being deleted...');
        
        this.projectService.delete(this.project.value()?.id!).subscribe({
          next: () => {
            this.formService.endSaveMessage('Project is being deleted...');
            this.router.navigate(['/', RouteItems.Dashboard]);
          },

          error: () => this.formService.saveErrorMessage('Project could not be deleted.')
        });
      },
    });
  }
}
