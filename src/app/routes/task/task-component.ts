import { NgStyle } from '@angular/common';
import { Component, computed, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
import { ChronometerPart } from '../../dtos/chronometer';
import { Tag, Task } from '../../dtos/project';
import { ProjectService } from '../../services/project-service';
import { StateService } from '../../services/state-service';
import { TagService } from '../../services/tag-service';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-component',
  imports: [Dialog, Inplace, FieldsetModule, FormsModule, TextareaModule, SelectModule, MultiSelectModule, AutoFocusModule, ChipModule, NgStyle, Button, ColorPicker, Divider],
  providers: [MessageService],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
  messageService = inject(MessageService);

  taskService = inject(TaskService);
  stateService = inject(StateService);
  tagService = inject(TagService);

  task = model.required<Task>();
  taskId = computed<number | null>(() => this.task().id ?? null);
  fullTask = this.taskService.get(this.taskId);
  visible = model.required<boolean>();
  createCallback = input<() => void>();

  states = this.stateService.getAll();
  projects = inject(ProjectService).getAll();
  otherTasks = inject(TaskService).getAll();

  tagToAdd = signal<Tag>({} as Tag);

  currentChronometerPart = signal<ChronometerPart>({
    seconds: 60 * 5,
    description: ''
  });
  currentChronometerPartPlaying = signal<boolean>(false);

  ngOnInit() {
    if (this.task().state === undefined && this.states.hasValue()) this.task().state = this.states.value()?.at(0)!;
  }

  onDelete(name: string, value: any) {
    switch (name) {
      case 'tag':
        this.tagService.delete(value.id).subscribe(deleted => {
          if (deleted) {
            this.task.update(t => {
              t.tags = t.tags?.filter(tag => tag.id !== value.id);
              return t;
            })
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
          }
        });
        break;
    
      default:
        break;
    }
  }

  onSubmit(name: string, value: any, closeCallback?: () => any) {
    switch (name) {
      case 'tagToAdd':
        this.tagService.create(value).subscribe(tagId => {
          if (!tagId) {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
            return;
          }

          this.task.update(p => {
            p.tags?.push({...value, id: tagId});
            return p;
          });
          this.tagToAdd.set({} as Tag);
        });
        break;

      case 'tag':
        this.tagService.edit(value).subscribe(ok => {
          if (ok) {
            closeCallback!();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
          }
        });
        break;
    
      default:
        if (this.task().id === null || this.task().id === undefined) {
          this.taskService.create(this.task()).subscribe(taskId => {
            if (taskId === null || taskId === undefined) {
              this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
            } else {
              this.task.update(t => {
                t.id = taskId;
                return t;
              });
              if (this.createCallback()) this.createCallback()!();
            }
          });
        } else {
          this.taskService.edit(this.task()).subscribe(ok => {
            if (!ok) {
              this.messageService.add({ severity: 'error', summary: 'Error', life: 3000 });
            }
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
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");

        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
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
