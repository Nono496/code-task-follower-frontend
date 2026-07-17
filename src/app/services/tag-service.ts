import { Injectable } from '@angular/core';
import { Tag, tagSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';

@Injectable({
  providedIn: 'root',
})
export class TagService extends CrudService<Tag> {
  protected override endpoint = '/tags';
  protected override parseSchema = tagSchema;
}
