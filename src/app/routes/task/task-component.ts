import { NgStyle } from '@angular/common';
import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { Button, ButtonDirective } from "primeng/button";
import { ChipModule } from 'primeng/chip';
import { ColorPicker } from "primeng/colorpicker";
import { Dialog } from "primeng/dialog";
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
    ButtonDirective
  ],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
  formService = inject(FormService);

  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  tagService = inject(TagService);

  lightTask = model.required<Task>();
  taskId = computed<number | null>(() => this.lightTask().id ?? null);
  fullTask = this.taskService.get(this.taskId);
  task = computed(() => {
    if (this.fullTask.hasValue() && !this.fullTask.error() && this.fullTask.value()) {
      return this.fullTask.value();
    }
    return this.lightTask();
  });

  visible = model.required<boolean>();
  mainProjectId = input.required<number>();
  createCallback = input<(task: Task) => void>();
  deleteCallback = input<(task: Task) => void>();

  states = this.projectService.getAllStates(this.mainProjectId);
  projects = inject(ProjectService).getAll();
  otherTasks = this.taskService.getAll();
  
  tags = this.tagService.getAll();
  initialTagToCreate = {color: '#ecff1a', name: ''};
  tagToCreate = signal<Tag>({...this.initialTagToCreate});

  currentChronometerPart = signal<ChronometerPart>({
    seconds: 60 * 5,
    description: '',
  });
  currentChronometerPartPlaying = signal<boolean>(false);

  onVisibleChange(visible: boolean) {
    if (visible) {
      this.states.reload();
      this.tags.reload();
    }
  }

  constructor() {
    effect(() => {
      if (this.lightTask().id === undefined) {
        this.fullTask.set({...this.lightTask()});
      }
    });
  }

  onDelete(name: string, value: any, event: Event) {
    switch (name) {
      case 'task':
        this.formService.confirmDelete(event, () => {
          this.formService.startSaveMessage('Task is being deleted...');
          
          this.taskService.delete(this.lightTask()?.id!).subscribe({
            next: () => {
              this.formService.endSaveMessage('Task has been deleted');
              this.deleteCallback()!(this.lightTask());
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
    this.formService.asyncOperation(
      this.taskService.addToTask(this.lightTask().id!, tag.id!),
      () => {
        const newTagList = [...(this.fullTask.value()?.tags ?? []), tag.id!];

        this.lightTask.update((lt) => {
          lt.tags = newTagList;
          return lt;
        });
        this.fullTask.update((ft) => {
          ft!.tags = newTagList;
          return ft;
        });

        this.tagToCreate.set({...this.initialTagToCreate});
      }
    );
  }

  onSubmit(name: string, value: any, closeCallback?: () => any) {
    switch (name) {
      case 'tagToCreate':
        if (!this.formService.validateSchema(tagSchema, value).success) {
          this.formService.saveErrorMessage();
          return;
        }

        this.formService.asyncOperation(
          this.tagService.create(value),
          (tagId) => {
            const tag = { ...value, id: tagId };
            this.addTag(tag);
            this.tags.update(t => [...t!, tag]);
          }
        );
        break;

      case 'tagToAdd':
        this.addTag(value);
        break;

      case 'tagToRemove':
        this.formService.asyncOperation(
          this.taskService.removeFromTask(this.lightTask().id!, value.id),
          () => {
            const newTagList = [...this.fullTask.value()!.tags?.filter(tId => tId !== value.id) ?? []];

            this.lightTask.update((lt) => {
              lt.tags = newTagList;
              return lt;
            });
            this.fullTask.update((ft) => {
              ft!.tags = newTagList;
              return ft;
            });

            this.formService.endSaveMessage();
            closeCallback!();
          }
        );
        break;

      case 'tag':
        if (!this.formService.validateSchema(tagSchema, value).success) {
          this.formService.saveErrorMessage();
          return;
        }
        
        this.formService.asyncOperation(
          this.tagService.edit(value),
          () => closeCallback!()
        );
        break;

      case 'state':
        this.formService.asyncOperation(
          this.taskService.updateTaskState(this.lightTask().id!, value),
          () => {
            this.lightTask.update(lt => {
              lt.stateId = value;
              return lt;
            });
            closeCallback!();
          }
        );
        break;

      default:
        if (this.task().id === null || this.task().id === undefined) {
          this.fullTask.update(ft => {
            ft!.stateId = this.states.value()![0].id!;
            return {...ft!};
          });
          
          const validation = this.formService.validateSchema(taskSchema, this.fullTask.value());
          if (!validation.success) {
            this.formService.saveErrorMessage('Invalid data', z.prettifyError(validation.error), 5000);
            return;
          }

          this.formService.startSaveMessage();
          this.taskService.create(this.fullTask.value()!).subscribe({
            next: taskId => {
              this.lightTask.update((t) => {
                return {...this.fullTask.value()!, id: taskId};
              });
              
              this.projectService.addTaskToProject(this.mainProjectId(), taskId).subscribe({
                next: () => {
                  if (this.createCallback()) this.createCallback()!(this.lightTask());
                  if (closeCallback) closeCallback();
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
          
          this.formService.asyncOperation(
            this.taskService.patch(this.lightTask().id!, this.formService.getPart(name, value)),
            () => {
              this.lightTask.update(lt => {
                (lt as { [key: string]: any; })[name] = value;
                return lt;
              })
              if (closeCallback) closeCallback();
            }
          );
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
