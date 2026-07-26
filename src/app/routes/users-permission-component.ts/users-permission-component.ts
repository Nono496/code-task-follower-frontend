import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { FormService } from '../../services/form-service';
import { ItemType, PlayerPermission, PlayerService } from '../../services/player-service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-users-permission-component',
  imports: [AccordionModule, DataViewModule, ToggleSwitchModule, FormsModule, SelectButtonModule, InputTextModule, FloatLabelModule],
  templateUrl: './users-permission-component.html',
  styleUrl: './users-permission-component.css',
})
export class UsersPermissionComponent {
  playerService = inject(PlayerService);
  formService = inject(FormService);

  nameQuery = signal<string>('');

  itemType = input.required<ItemType>();
  itemId = input.required<number>();

  itemPlayers = this.playerService.getItemPlayers(this.itemId, this.itemType);
  allPlayers = this.playerService.getPlayers(this.nameQuery);

  mode = signal<'add' | 'update'>('update');
  changeModes = [
    {
      label: 'Add',
      value: 'add'
    },
    {
      label: 'Update',
      value: 'update'
    }
  ] as {label: string, value: 'add' | 'update'}[];

  onChangePermission(playerPermissions: PlayerPermission) {
    this.formService.asyncOperation(
      this.playerService.updatePlayerPermissionsForItem(playerPermissions, this.itemId(), this.itemType(), this.mode()),
      () => {
        if (playerPermissions.read) {
          playerPermissions.add =
          playerPermissions.update =
          playerPermissions.delete =
          playerPermissions.admin = false;
        } else if (playerPermissions.admin) {
          playerPermissions.add =
          playerPermissions.update =
          playerPermissions.delete =
          playerPermissions.read = false;
        } else {
          playerPermissions.read = false;
        }

        this.itemPlayers.set(this.itemPlayers.value());
      }
    );
  }
}
