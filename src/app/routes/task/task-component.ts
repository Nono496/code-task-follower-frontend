import { Component, input, model } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { Task } from '../../dtos/project';
import { Inplace } from "primeng/inplace";
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { ChipModule } from 'primeng/chip';
import { NgStyle } from '@angular/common';
import { Button } from "primeng/button";

@Component({
  selector: 'app-task-component',
  imports: [Dialog, Inplace, FormsModule, AutoFocusModule, ChipModule, NgStyle, Button],
  templateUrl: './task-component.html',
  styleUrl: './task-component.css',
})
export class TaskComponent {
  task = input.required<Task>();
  visible = model.required<boolean>();

  onSubmit(name: string, value: any) {
    // TODO
    console.log(name + ": " + value)
  }
}
