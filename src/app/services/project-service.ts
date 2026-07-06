import { Injectable, InputSignal } from '@angular/core';
import { Project, projectSchema, State } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends CrudService<Project> {
  protected override endpoint = '/projects';
  protected override parseSchema = projectSchema;

  getAllStates(projectId: InputSignal<number>): HttpResourceRef<State[] | undefined> {
    return httpResource<State[]>(() => this.endpoint + '/' + projectId() + '/states');
  }

  addToProject(projectId: number, stateId: number) {
    return this.http.put<void>(this.endpoint + '/' + projectId + '/state/' + stateId, null);
  }
  removeFromProject(projectId: number, stateId: number) {
    return this.http.delete<void>(this.endpoint + '/' + projectId + '/state/' + stateId);
  }
}
