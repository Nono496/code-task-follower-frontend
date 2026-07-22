import { Component, effect, inject, signal } from '@angular/core';
import { SignInFormComponent } from '../../signin/sign-in-form-component/sign-in-form-component';
import { Dialog } from "primeng/dialog";
import { Button } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { Player, PlayerService } from '../../../../services/player-service';
import { CheckboxModule } from "primeng/checkbox";
import { Divider } from "primeng/divider";
import { FormsModule } from "@angular/forms";
import { FormService } from '../../../../services/form-service';

@Component({
  selector: 'app-admin-settings-component',
  imports: [SignInFormComponent, Dialog, Button, DataViewModule, CheckboxModule, Divider, FormsModule],
  templateUrl: './admin-settings-component.html',
  styleUrl: './admin-settings-component.css',
})
export class AdminSettingsComponent {
  playerService = inject(PlayerService);
  formService = inject(FormService);

  signInFormVisible = signal(false);

  nameQuery = signal('');
  players = this.playerService.getPlayers(this.nameQuery);

  onSignIn() {
    this.players.reload();
    this.signInFormVisible.set(false);
  }

  onChangeIsAdmin(player: Player) {
    this.formService.asyncOperation(
      this.playerService.updatePlayer({id: player.id, isAdmin: player.isAdmin})
    )
  }
}
