import { Injectable, InputSignal } from '@angular/core';
import { State, stateSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StateService extends CrudService<State> {
  protected override endpoint = '/states';
  protected override parseSchema = stateSchema;
}
