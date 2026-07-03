import { Injectable } from '@angular/core';
import { Project, projectSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends CrudService<Project> {
  protected override endpoint = '/projects';
  protected override parseSchema = projectSchema;
}
