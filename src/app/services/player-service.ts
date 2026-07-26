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

  getItemPlayers(itemId: Signal<number| null>, itemType: Signal<ItemType>) {
    return httpResource<PlayerPermission[]>(() => {
      if (itemId() === null || itemId() === undefined) return undefined;
    
      return itemType() + itemId() + this.endpoint;
    });
  }

  getItemPlayerResource(itemId: Signal<number | null | undefined>, itemType: ItemType) {
    return httpResource<PlayerPermission>(() => {
      if (itemId() === null || itemId() === undefined) return undefined;

      return itemType + itemId() + this.endpoint.replace('s', '');
    });
  }
  getItemPlayer(itemId: number, itemType: ItemType) {
    return this.http.get<PlayerPermission>(itemType + itemId + this.endpoint.replace('s', ''))
  }

  updatePlayer(player: Partial<Player>): Observable<void> {
    return this.http.patch<void>(this.endpoint + '/' + player.id, player);
  }

  updatePlayerPermissionsForItem(playerPermissions: PlayerPermission, itemId: number, itemType: ItemType, mode: 'add' | 'update'): Observable<void> {
    if(mode === 'add') {
      return this.http.post<void>(itemType + itemId + this.endpoint, playerPermissions);
    } else if (playerPermissions.read || playerPermissions.add || playerPermissions.update || playerPermissions.delete || playerPermissions.admin) {
      return this.http.put<void>(itemType + itemId + this.endpoint, playerPermissions);
    } else {
      return this.http.delete<void>(itemType + itemId + this.endpoint + '/' + playerPermissions.id);
    }
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
