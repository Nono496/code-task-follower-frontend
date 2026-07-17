import { HttpResourceRef } from "@angular/common/http";
import { Injectable, Signal } from "@angular/core";
import { AnyType } from "../dtos/zod-schemas";
import { ModelType } from './live-update-service';

@Injectable({
  providedIn: 'root',
})
export class ResourceCacheService {
    public cache: {name: Signal<string | undefined>, modelType: ModelType, resource: HttpResourceRef<AnyType | AnyType[] | undefined>, delayed: boolean}[] = [];
    public useCache(
        name: Signal<string | undefined>,
        valueFunction: () => HttpResourceRef<AnyType | AnyType[] | undefined>,
        modelType: ModelType,
        delayed = false
    ): HttpResourceRef<any> {
        if (!delayed && name() !== undefined) {
            let resource: HttpResourceRef<any> | undefined = this.cache.filter(c =>
                !c.delayed &&
                c.resource.hasValue() && 
                c.resource.error() === undefined &&
                c.name() === name()).at(0)?.resource;
            if (resource) return resource;
        }
    
        let resource = valueFunction();
        this.cache.push({name, modelType, resource, delayed});
        return resource;
    }
}