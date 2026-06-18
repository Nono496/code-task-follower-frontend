import { Injectable } from '@angular/core';
import { Task } from '../dtos/project';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends CrudService<Task> {
  protected override endpoint = '/tasks';
}
