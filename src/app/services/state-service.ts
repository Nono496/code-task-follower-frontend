import { Injectable } from '@angular/core';
import { State, stateSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { ModelType } from './live-update-service';

@Injectable({
  providedIn: 'root',
})
export class StateService extends CrudService<State> {
  protected override endpoint = '/states';
  protected override parseSchema = stateSchema;
    protected override modelType: ModelType = 'StateDto';
}
