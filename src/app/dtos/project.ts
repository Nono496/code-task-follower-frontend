import { CrudItem } from "../services/crud-service";
import { Chronometer } from "./chronometer";

export interface Project extends CrudItem {
    id?: number;
    name?: string;
    states?: State[];
    description?: string;
    color?: string;
    tags?: Tag[];
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
interface Branch extends CrudItem {}
export interface State extends CrudItem {
    id?: number;
    name?: string;
    color?: string;
}
export interface Commit extends CrudItem {}
export interface Code extends CrudItem {}