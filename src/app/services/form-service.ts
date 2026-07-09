import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ZodObject, ZodSafeParseResult } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class FormService {
    private _messageService?: MessageService;
    public set messageService(ms: MessageService) {
        this._messageService = ms;
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
        this._messageService!.add({ severity: 'error', summary, detail, life, closable: true });
    }
}