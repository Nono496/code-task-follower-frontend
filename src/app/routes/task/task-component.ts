import { NgStyle } from '@angular/common';
import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { Button } from "primeng/button";
import { ChipModule } from 'primeng/chip';
import { ColorPicker } from "primeng/colorpicker";
import { Dialog } from "primeng/dialog";
import { Divider } from "primeng/divider";
import { FieldsetModule } from 'primeng/fieldset';
import { Inplace } from "primeng/inplace";
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from "primeng/select";
import { TextareaModule } from 'primeng/textarea';
import z from 'zod';
import { ChronometerPart, Tag, tagSchema, Task, taskSchema } from '../../dtos/zod-schemas';
import { FormService } from '../../services/form-service';
import { ProjectService } from '../../services/project-service';
import { TagService } from '../../services/tag-service';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-component',
  imports: [
    Dialog,
    Inplace,
    FieldsetModule,
    FormsModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    AutoFocusModule,
    ChipModule,
    NgStyle,
    Button,
    ColorPicker,
    Divider,
],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
  formService = inject(FormService);

  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  tagService = inject(TagService);

  task = model.required<Task>();
  taskId = computed<number | null>(() => this.task().id ?? null);
  fullTask = this.taskService.get(this.taskId);
  visible = model.required<boolean>();
  createCallback = input<() => void>();
  deleteCallback = input<(task: Task) => void>();

  mainProjectId = input.required<number>();
  states = this.projectService.getAllStates(this.mainProjectId);
  projects = inject(ProjectService).getAll();
  otherTasks = this.taskService.getAll();

  tagToCreate = signal<Tag>({color: '#ecff1a', name: ''});
  otherTags = this.tagService.getAll();

  currentChronometerPart = signal<ChronometerPart>({
    seconds: 60 * 5,
    description: '',
  });
  currentChronometerPartPlaying = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.task().state === undefined && this.states.hasValue()) {
        this.task().state = this.states.value()?.at(0)!;
      }
    });
  }

  onDelete(name: string, value: any, event: Event) {
    switch (name) {
      case 'task':
        this.formService.confirmDelete(event, () => {
          this.formService.startSaveMessage('Task is being deleted...');
          
          this.taskService.delete(this.task()?.id!).subscribe({
            next: () => {
              this.formService.endSaveMessage('Task has been deleted');
              this.deleteCallback()!(this.task());
              this.visible.set(false);
            },
  
            error: () => this.formService.saveErrorMessage('Task could not be deleted.')
          });
        });
        break;

      /*case 'tag':
        this.formService.startSaveMessage('Deleting tag...');
        this.tagService.delete(value.id).subscribe({
          next: () => {
            this.task.update((t) => {
              t.tags = t.tags?.filter((tag) => tag.id !== value.id);
              return t;
            });
            this.formService.endSaveMessage('Tag deleted');
          },
          error: () => this.formService.saveErrorMessage()
        });
        break;*/

      default:
        break;
    }
  }

  addTag(tag: Tag) {
    this.formService.startSaveMessage();
    this.taskService.addToTask(this.task().id!, tag.id!).subscribe({
      next: () => {
        this.task.update((p) => {
          p.tags = p.tags?.length ? p.tags : [];
          p.tags.push(tag);
          return p;
        });
        this.tagToCreate.set({color: '#ecff1a', name: ''});
        this.formService.endSaveMessage();
      },
      error: () => this.formService.saveErrorMessage()
    });
  }

  onSubmit(name: string, value: any, closeCallback?: () => any) {
    switch (name) {
      case 'tagToCreate':
        if (!this.formService.validateSchema(tagSchema, value).success) {
          this.formService.saveErrorMessage();
          return;
        }

        this.formService.startSaveMessage();
        this.tagService.create(value).subscribe({
          next: (tagId) => {
            this.addTag({ ...value, id: tagId });
          },
          error: () => this.formService.saveErrorMessage()
        });
        break;

      case 'tagToAdd':
        this.addTag(value);
        break;

      case 'tagToRemove':        
        this.formService.startSaveMessage();
        this.taskService.removeFromTask(this.task().id!, value.id).subscribe({
          next: () => {
            this.task.update((p) => {
              p.tags = p.tags?.filter(t => t.id !== value.id);
              return p;
            });
            this.formService.endSaveMessage();
            closeCallback!();
          },
          error: () => this.formService.saveErrorMessage()
        });
        break;

      case 'tag':
        if (!this.formService.validateSchema(tagSchema, value).success) {
          this.formService.saveErrorMessage();
          return;
        }
        
        this.formService.startSaveMessage();
        this.tagService.edit(value).subscribe({
          next: () => {
            closeCallback!();
            this.formService.endSaveMessage();
          },
          error: () => this.formService.saveErrorMessage()
        });
        break;

      case 'state':
        this.formService.startSaveMessage();
        this.taskService.updateTaskState(this.task().id!, this.task().state!.id!).subscribe({
          next: () => {
            this.formService.endSaveMessage();
            closeCallback!();
          },
          error: () => this.formService.saveErrorMessage()
        });
        break;

      default:
        if (this.task().id === null || this.task().id === undefined) {
          const validation = this.formService.validateSchema(taskSchema, this.task());
          if (!validation.success) {
            this.formService.saveErrorMessage('Invalid data', z.prettifyError(validation.error), 5000);
            return;
          }

          this.formService.startSaveMessage();
          this.taskService.create(this.task()).subscribe({
            next: taskId => {
              this.task.update((t) => {
                t.id = taskId;
                return t;
              });
              
              this.projectService.addTaskToProject(this.mainProjectId(), taskId).subscribe({
                next: () => {
                  if (this.createCallback()) this.createCallback()!();
                  this.formService.endSaveMessage();
                },
                error: () => this.formService.saveErrorMessage()
              });
            },
            error: () => this.formService.saveErrorMessage()
          });
        } else {
          if (!this.formService.validateProp(taskSchema, name, value).success) {
            this.formService.saveErrorMessage();
            return;
          }
          
          this.formService.startSaveMessage();
          this.taskService.edit(this.task()).subscribe({
            next: () => this.formService.endSaveMessage(),
            error: () => this.formService.saveErrorMessage()
          });
        }
        break;
    }
  }

  async onPipOpen(pipElement: HTMLElement) {
    if (window.documentPictureInPicture.window) {
      return;
    }

    const pipWindow = await window.documentPictureInPicture.requestWindow();
    pipWindow.document.body.append(pipElement.cloneNode(true));

    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
        const style = document.createElement('style');

        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = styleSheet.type;
        //link.media = styleSheet.media;
        link.href = styleSheet.href ?? '';
        pipWindow.document.head.appendChild(link);
      }
    });
  }
}

declare global {
  interface Window {
    documentPictureInPicture: DocumentPictureInPicture;
  }
  interface DocumentPictureInPicture {
    window: Window;
    requestWindow(): Promise<Window>;
  }
}
