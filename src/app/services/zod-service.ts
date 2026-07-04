import { Injectable } from '@angular/core';
import { ZodObject, ZodSafeParseResult } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class ZodService {
    validateProp(schema: ZodObject, name: string, value: any): ZodSafeParseResult<Record<string, unknown>> {
        const prop: { [key: string]: any; } & Record<string | number, never> = {};
        prop[name] = value as any & never;

        return schema.pick(prop).safeParse(prop);
    }

    validateSchema(schema: ZodObject, value: any): ZodSafeParseResult<Record<string, unknown>> {
        return schema.safeParse(value);
    }
}