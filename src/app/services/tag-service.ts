import { Injectable } from '@angular/core';
import { Tag } from '../dtos/project';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class TagService extends CrudService<Tag> {
  protected override endpoint = '/tags';
}
