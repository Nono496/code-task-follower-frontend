import { NgStyle } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { Task } from '../../dtos/zod-schemas';
import { ProjectService } from '../../services/project-service';
import { TaskService } from '../../services/task-service';
import { TaskComponent } from "../task/task-component";

@Component({
  selector: 'app-dashboard',
  imports: [DataViewModule, TagModule, CardModule, NgStyle, DividerModule, ButtonModule, RouterLink, TaskComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class Dashboard {
  projects = inject(ProjectService).getAll();
  tasks = inject(TaskService).getAll();// TODO Apply filter to get only those in dev
}
