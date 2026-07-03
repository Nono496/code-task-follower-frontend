import { Injectable } from '@angular/core';
import { Task, taskSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends CrudService<Task> {
  protected override endpoint = '/tasks';
  protected override parseSchema = taskSchema;
}
