import { Injectable } from '@angular/core';
import { Tag, tagSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { ModelType } from './live-update-service';

@Injectable({
  providedIn: 'root',
})
export class TagService extends CrudService<Tag> {
  protected override endpoint = '/tags';
  protected override parseSchema = tagSchema;
    protected override modelType: ModelType = 'TagDto';
}
