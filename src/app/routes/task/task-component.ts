import { NgStyle } from '@angular/common';
import { Component, inject, input, model, signal } from '@angular/core';
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
import { ChronometerPart } from '../../dtos/chronometer';
import { Project, State, Tag, Task } from '../../dtos/project';
import { ProjectService } from '../../services/project-service';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-component',
  imports: [Dialog, Inplace, FieldsetModule, FormsModule, TextareaModule, SelectModule, MultiSelectModule, AutoFocusModule, ChipModule, NgStyle, Button, ColorPicker, Divider],
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

  currentChronometerPart = signal<ChronometerPart>({
    seconds: 60 * 5,
    description: ''
  });
  currentChronometerPartPlaying = signal<boolean>(false);

  ngOnInit() {
    if (this.task().state === undefined) this.task().state = this.states()?.at(0)!;
  }

  onSubmit(name: string, value: any) {
    // TODO
    console.log(name + ":");
    console.table(value)
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
