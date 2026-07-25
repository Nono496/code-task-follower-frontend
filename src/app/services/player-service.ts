import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private http = inject(HttpClient);
  private endpoint = '/players';

  getPlayers(nameQuery: Signal<string>) {
    return httpResource<Player[]>(() => {
      const query = nameQuery().length ? '/search?name=' + nameQuery() : '';
      return this.endpoint + query
    });
  }

  getItemPlayers(itemId: Signal<number>, itemType: Signal<ItemType>) {
    return httpResource<PlayerPermission[]>(() => itemType() + itemId() + this.endpoint);
  }

  updatePlayer(player: Partial<Player>): Observable<void> {
    return this.http.patch<void>(this.endpoint + '/' + player.id, player);
  }

  updatePlayerPermissionsForItem(playerPermissions: PlayerPermission, itemId: number, itemType: ItemType): Observable<void> {
    return this.http.put<void>(itemType + itemId + this.endpoint, playerPermissions);
  }
}

export type Player = {
  id: number,
  username: string,
  isAdmin: boolean
};

export type PlayerPermission = {
  id: number;
  username: string;
  read: boolean;
  add: boolean;
  update: boolean;
  delete: boolean;
  admin: boolean;
}

export enum ItemType {
  Project = '/projects/',
  Task = '/tasks/'
}