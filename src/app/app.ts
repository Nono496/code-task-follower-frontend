import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { FormService } from './services/form-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  formService = inject(FormService);
  messageService = inject(MessageService);

  constructor() {
    this.formService.messageService = this.messageService;
  }
}
