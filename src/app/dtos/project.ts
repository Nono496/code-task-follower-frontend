import { Chronometer } from "./chronometer";

export type Project = {
    id: number;
    name: string;
    description?: string;
    color: string;
    tags: Tag[];
    tasks: Task[];
    branches: Branch[];
}

export type Task = {
    id: number;
    name: string;
    state: State;
    chronometer: Chronometer;
    tags: Tag[];
    dependencies: Task[];
    projects: Project[];
    commits: Commit[];
    codes: Code[];
};

export type Tag = {
    id: number;
    name: string;
    color: string;
}
type Branch = {}
export type State = {
    id: number;
    name: string;
    color: string;
}
export type Commit = {}
export type Code = {}