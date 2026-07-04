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

  getAll(): HttpResourceRef<T[] | undefined> {
    return httpResource<T[]>(() => this.endpoint);
  }

  get(itemId: Signal<number | null | undefined>, defaultValue: T | undefined = undefined): HttpResourceRef<T | undefined> {
    return httpResource<T>(
      () => {
        if (!itemId()) return undefined;

        return this.endpoint + '/' + itemId()
      },
      {
        defaultValue,
        parse: (data) => {
          const result = this.parseSchema.safeParse(data);

          if (!result.success) {
            throw new Error(result.error);
          } else {
            return result.data;
          }
        }
      }
    );
  }
  
  create(item: T): Observable<number> {
    return this.http.post<number>(this.endpoint, item);
  }

  edit(item: T): Observable<void> {
    return this.http.put<void>(this.endpoint + '/' + item.id, item);
  }

  delete(itemId: number): Observable<void> {
    return this.http.delete<void>(this.endpoint + '/' + itemId)
  }
}