import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from "primeng/toast";
import { FormService } from './services/form-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialog],
  providers: [MessageService, ConfirmationService, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  formService = inject(FormService);

  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  constructor() {
    this.formService.messageService = this.messageService;
    this.formService.confirmationService = this.confirmationService;
  }
}
