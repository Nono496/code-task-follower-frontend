import { computed, Injectable, InputSignal } from '@angular/core';
import { Project, projectSchema, State } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { ModelType } from './live-update-service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends CrudService<Project> {
  protected override endpoint = '/projects';
  protected override parseSchema = projectSchema;
  protected override modelType: ModelType = 'ProjectDto';

  getAllStates(projectId: InputSignal<number>): HttpResourceRef<State[] | undefined> {
    const name = computed(() => "getAllStatesFor " + projectId());
    return this.cacheService.useCache(name,
      () => httpResource<State[]>(() => this.endpoint + '/' + projectId() + '/states'),
      'StateDto',
      true
    );

  }

  addStateToProject(projectId: number, stateId: number) {
    return this.http.put<void>(this.endpoint + '/' + projectId + '/state/' + stateId, null);
  }
  removeFromProject(projectId: number, stateId: number) {
    return this.http.delete<void>(this.endpoint + '/' + projectId + '/state/' + stateId);
  }

  addTaskToProject(projectId: number, taskId: number) {
    return this.http.put<void>(this.endpoint + '/' + projectId + '/task/' + taskId, null);
  }
}
