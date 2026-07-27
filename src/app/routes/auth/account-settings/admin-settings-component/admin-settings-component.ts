import { Component, inject, signal } from '@angular/core';
import { RegisterFormComponent } from '../../register/register-form-component/register-form-component';
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
  imports: [RegisterFormComponent, Dialog, Button, DataViewModule, CheckboxModule, Divider, FormsModule],
  templateUrl: './admin-settings-component.html',
  styleUrl: './admin-settings-component.css',
})
export class AdminSettingsComponent {
  playerService = inject(PlayerService);
  formService = inject(FormService);

  registerFormVisible = signal(false);

  nameQuery = signal('');
  players = this.playerService.getPlayers(this.nameQuery);

  onRegister() {
    this.players.reload();
    this.registerFormVisible.set(false);
  }

  onChangeIsAdmin(player: Player) {
    this.formService.asyncOperation(
      this.playerService.updatePlayer({id: player.id, isAdmin: player.isAdmin})
    )
  }
}
