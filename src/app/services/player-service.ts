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
      const query = nameQuery().length ? '?name=' + nameQuery() : '';
      return this.endpoint + query
    });
  }

  updatePlayer(player: Partial<Player>): Observable<void> {
    return this.http.patch<void>(this.endpoint + '/' + player.id, player);
  }
}

export type Player = {
  id: number,
  username: string,
  isAdmin: boolean
};