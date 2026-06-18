import { Injectable } from '@angular/core';
import { Project } from '../dtos/project';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends CrudService<Project> {
  protected override endpoint = '/projects';
}
