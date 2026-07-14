import { Injectable } from '@angular/core';
import { State, stateSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class StateService extends CrudService<State> {
  protected override endpoint = '/states';
  protected override parseSchema = stateSchema;
}
