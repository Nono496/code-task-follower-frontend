import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceCacheService } from './resource-cache-service';
import { ModelType } from './live-update-service';

export type CrudItem = {
    id?: number;
}

export abstract class CrudService<T extends CrudItem> {
  protected http = inject(HttpClient);
  protected abstract endpoint: string;
  protected abstract parseSchema: any;
  protected cacheService = inject(ResourceCacheService);
  protected abstract modelType: ModelType;

  getAll(): HttpResourceRef<T[] | undefined> {
    return this.cacheService.useCache(
      signal("getAll"),
      () => httpResource<T[]>(() => this.endpoint),
      this.modelType
    );
  }

  get(itemId: Signal<number | null | undefined>, defaultValue: T | undefined = undefined): HttpResourceRef<T | undefined> {
    return this.cacheService.useCache(computed(() => itemId() === undefined ? undefined : "get " + itemId()),
      () => httpResource<T>(
        () => {
          if (!itemId()) return undefined;

          return this.endpoint + '/' + itemId()
        },
        {
          defaultValue,
        }
      ),
      this.modelType,
      true
    );
  }
  
  create(item: T): Observable<number> {
    return this.http.post<number>(this.endpoint, item);
  }

  edit(item: T): Observable<void> {
    return this.http.put<void>(this.endpoint + '/' + item.id, item);
  }

  patch(id: number, partial: Partial<T>): Observable<void> {
    return this.http.patch<void>(this.endpoint + '/' + id, partial);
  }

  delete(itemId: number): Observable<void> {
    return this.http.delete<void>(this.endpoint + '/' + itemId)
  }
}