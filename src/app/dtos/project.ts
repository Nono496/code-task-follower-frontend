import { CrudItem } from "../services/crud-service";
import { Chronometer } from "./chronometer";

export interface Project extends CrudItem {
    id?: number;
    name?: string;
    color: string;
    description?: string;
    states?: State[];
    tasks?: Task[];
    branches?: Branch[];
}

export interface Task extends CrudItem {
    id?: number;
    name?: string;
    state?: State;
    chronometer?: Chronometer;
    tags?: Tag[];
    dependencies?: Task[];
    projects?: Project[];
    commits?: Commit[];
    codes?: Code[];
};

export interface Tag extends CrudItem {
    id?: number;
    name?: string;
    color?: string;
}
interface Branch extends CrudItem {
    id: number;
    repositoryName: string;
    branchName: string;
}
export interface State extends CrudItem {
    id?: number;
    name?: string;
    color?: string;
}
export interface Commit extends CrudItem {
    id: number;
    hash: string;
    tasks: Task[];
}
export interface Code extends CrudItem {
    id: number;
    branch: Branch;
    classPath: string;
}