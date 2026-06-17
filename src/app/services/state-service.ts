import { Injectable } from '@angular/core';
import { State } from '../dtos/project';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class StateService extends CrudService<State> {
  protected override endpoint = '/states';
}
