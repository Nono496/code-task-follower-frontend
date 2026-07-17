import { inject, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from "../../environments/environment";
import { ResourceCacheService } from "./resource-cache-service";
import { AnyType } from "../dtos/zod-schemas";

@Injectable({
  providedIn: 'root',
})
export class LiveUpdateService {
    resourceCacheService = inject(ResourceCacheService);
    websocketSubject?: WebSocketSubject<unknown>;
    token: string | undefined;
    
    init(token?: string) {
        this.close();
        if (token) this.token = token;
        if (this.token === undefined) return;

        this.websocketSubject = webSocket('ws://' + environment.apiUrl + '/models');
        
        this.websocketSubject.next({token});
        
        this.websocketSubject.subscribe({
            next: update => this.updateCache(update as ModelUpdate),
            error: error => {
                this.restart();
                console.error(error);
            }
        });
    }
    
    restart() {
        setTimeout(() => this.init(), 10000);
    }

    close() {
        this.websocketSubject?.complete();
        this.token = undefined;
    }

    updateCache(update: ModelUpdate) {
        this.resourceCacheService.cache.forEach(c => {
            if (c.resource.hasValue()) {
                c.resource.set(this.updateObject(c.resource.value(), c.modelType, update) as AnyType | AnyType[]);
            }
        });
    }

    updateObject(obj: AnyType | AnyType[] | number[], modelType: ModelType, update: ModelUpdate): AnyType | AnyType[] | number[] {
        
        // Update the object
        if (update.modelType === modelType && update.modelAction === 'update' && !Array.isArray(obj) && obj.id === update.id) {
            console.log("updated", obj, update)
            obj = {...obj, ...update};
        }
        
        // Update its children
        if (Array.isArray(obj)) {
            if (!obj?.length) return obj;
            
            // Create
            if (update.modelAction === 'create') {
                // FIXME Push number or object ?
            }
            
            // Delete
            /*if (update.modelAction === 'delete' && (typeof obj[0] === 'number' && obj.includes(update.id!)) || (obj as AnyType[]).filter(e => e.id === update.id)) {
               obj = obj.filter(child => child !== update.id && (typeof child === 'number' || (child as AnyType)?.id !== update.id)) as AnyType | AnyType[] | number[];
            }*/
            
            // Deep array update
            if (typeof (obj as any[])[0] !== 'number') {
                for (let index = 0; index < (obj as AnyType[]).length; index++) {
                    (obj as AnyType[])[index] = this.updateObject((obj as AnyType[])[index], modelType, update) as AnyType;            
                }
            }
        } else {
            // Deep object update
            const children = modelArchitectures.filter(ma => ma.model === modelType).at(0)?.children;
            if (children) {
                for (let childIndex = 0; childIndex < children.length; childIndex++) {
                    const childArchitecture = children[childIndex];
                    (obj as any)[childArchitecture.name] = this.updateObject((obj as any)[childArchitecture.name], childArchitecture.modelType, update);
                }
            }
        }

        return obj;
    }
}

type ModelUpdate = AnyType & {modelType: ModelType, modelAction: 'create' | 'update' | 'delete'};

export type ModelType = 'AuthDto' | 'BranchDto' | 'ChronometerDto' | 'ChronometerPartDto' | 'CodeDto' | 'CommitDto' | 'LightProjectDto' | 'LightTaskDto' | 'ProjectDto' | 'StateDto' | 'TagDto' | 'TaskDto';
type ModelChild = {name: string, modelType: ModelType}

const modelArchitectures: { model: ModelType, children: ModelChild[] }[] = [
    {
        model: 'TaskDto',
        children: [
            /*{
                name: 'chronometer',
                modelType: 'ChronometerDto'
            },
            {
                name: 'stateId',
                modelType: 'StateDto'
            },
            {
                name: 'tags',
                modelType: 'TagDto'
            }*/
        ]
    },
    {
        model: 'ProjectDto',
        children: [
            {
                name: 'states',
                modelType: 'StateDto'
            },
            {
                name: 'tasks',
                modelType: 'TaskDto'
            }
        ]
    }
];