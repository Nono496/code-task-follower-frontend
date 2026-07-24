import { Injectable } from '@angular/core';
import { Chronometer, ChronometerPart, chronometerPartSchema, chronometerSchema, Task, taskSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChronometerService extends CrudService<Chronometer> {
    protected override endpoint = '/chronometer';
    protected override parseSchema = chronometerSchema;

    addToTask(taskId: number): Observable<number> {
      return this.http.post<number>(this.endpoint + '/' + taskId, null).pipe(
        switchMap(chronometerId => this.createPart(taskId))
      );
    }

    createPart(taskId: number): Observable<number> {
      return this.http.post<number>(this.endpoint + '/' + taskId + '/part', null);
    }

    editPart(taskId: number, part: ChronometerPart): Observable<number> {
        return this.http.put<number>(this.endpoint + '/' + taskId + '/part/' + part.id!, part);
    }

    deletePart(taskId: number, partId: number): Observable<number> {
        return this.http.delete<number>(this.endpoint + '/' + taskId + '/part/' + partId);
    }
}