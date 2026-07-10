import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ZodObject, ZodSafeParseResult } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class FormService {
    private _messageService?: MessageService;
    public set messageService(ms: MessageService) {
        this._messageService = ms;
    }

    private _confirmationService?: ConfirmationService;
    public set confirmationService(ms: ConfirmationService) {
        this._confirmationService = ms;
    }

    validateProp(schema: ZodObject, name: string, value: any): ZodSafeParseResult<Record<string, unknown>> {
        const prop: { [key: string]: any; } & Record<string | number, never> = {};
        prop[name] = value as any & never;

        return schema.pick(prop).safeParse(prop);
    }

    validateSchema(schema: ZodObject, value: any): ZodSafeParseResult<Record<string, unknown>> {
        return schema.safeParse(value);
    }

    startSaveMessage(summary = 'Saving...') {
        this._messageService!.clear('saved');
        this._messageService!.add({ key: 'saving', severity: 'info', summary });
    }
    endSaveMessage(summary = 'Saved') {
        this._messageService!.clear('saving');
        this._messageService!.add({ key: 'saved', severity: 'success', summary, life: 2000 });
    }
    saveErrorMessage(summary = 'Error', detail: string | undefined = undefined, life = 2000) {
        this._messageService!.clear('saving');
        this._messageService!.add({ key: 'error', severity: 'error', summary, detail, life, closable: true });
    }

    confirmDelete(event: Event, accept: () => void) {
        this._confirmationService!.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept,
        });
    }
}