import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';

export type CrudItem = {
    id?: number;
}

export abstract class CrudService<T extends CrudItem> {
  protected http = inject(HttpClient);
  protected abstract endpoint: string;
  protected abstract parseSchema: any;

  private cache: {name: string, resource: HttpResourceRef<any>}[] = [];
  protected useCache(name: string, valueFunction: () => HttpResourceRef<any>): HttpResourceRef<any> {
    let resource: HttpResourceRef<any> | undefined = this.cache.filter(c => c.name === name).at(0)?.resource;
    if (resource && resource.error() === undefined) return resource;

    resource = valueFunction();
    this.cache.push({name, resource});
    return resource;
  }

  getAll(): HttpResourceRef<T[] | undefined> {
    return this.useCache("getAll", () => httpResource<T[]>(() => this.endpoint));
  }

  get(itemId: Signal<number | null | undefined>, defaultValue: T | undefined = undefined): HttpResourceRef<T | undefined> {
    return this.useCache("get",
      () => httpResource<T>(
        () => {
          if (!itemId()) return undefined;

          return this.endpoint + '/' + itemId()
        },
        {
          defaultValue,
        }
      )
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