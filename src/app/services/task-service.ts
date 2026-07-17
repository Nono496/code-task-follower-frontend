import { Injectable } from '@angular/core';
import { Task, taskSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { Observable } from 'rxjs';
import { ModelType } from './live-update-service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends CrudService<Task> {
  protected override endpoint = '/tasks';
  protected override parseSchema = taskSchema;
    protected override modelType: ModelType = 'TaskDto';

  addToTask(taskId: number, tagId: number): Observable<void> {
    return this.http.put<void>(this.endpoint + '/' + taskId + '/tag/' + tagId, null);
  }
  removeFromTask(taskId: number, tagId: number): Observable<void> {
    return this.http.delete<void>(this.endpoint + '/' + taskId + '/tag/' + tagId);
  }
  
  updateTaskState(taskId: number, stateId: number): Observable<void> {
    return this.http.put<void>(this.endpoint + '/' + taskId + '/state/' + stateId, null);
  }
}
