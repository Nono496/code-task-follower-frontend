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

  get(itemId: Signal<number | null | undefined>, defaultValue: T | undefined = undefined): HttpResourceRef<T | undefined> {
    return httpResource<T>(
      () => {
        if (!itemId()) return undefined;

        return this.endpoint + '/' + itemId()
      }, { defaultValue }
    );
  }
  
  create(item: T): Observable<number> {
    return this.http.post<number>(this.endpoint, item);
  }

  edit(item: T): Observable<boolean> {
    return this.http.put<void>(this.endpoint + '/' + item.id, item, { observe: 'response' })
      .pipe(map((response) => response.ok ));
  }

  delete(itemId: number): Observable<boolean> {
    return this.http.delete(this.endpoint + '/' + itemId, { observe: 'response' })
      .pipe(map((response) => response.ok ));
  }
}