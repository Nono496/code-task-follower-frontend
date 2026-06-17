import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';

export type CrudItem = {
    id?: number;
}

export abstract class CrudService<T extends CrudItem> {
  protected http = inject(HttpClient);
  protected abstract endpoint: string;

  getAll(): HttpResourceRef<T[] | undefined> {
    return httpResource<T[]>(() => this.endpoint);
  }

  get(itemId: Signal<number>): HttpResourceRef<T | undefined> {
    return httpResource<T>(() => this.endpoint + itemId());
  }
  
  create(item: T): Observable<T> {
    return this.http.post<T>(this.endpoint, item);
  }

  edit(item: T): Observable<T> {
    return this.http.put<T>(this.endpoint + '/' + item.id, item);
  }

  delete(itemId: number): Observable<boolean> {
    return this.http.delete<T>(this.endpoint + '/' + itemId, { observe: 'response' })
      .pipe(map((response) => response.ok ));
  }
}