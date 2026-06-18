import { CrudItem } from "../services/crud-service";

export interface User extends CrudItem {
    id?: number;
    username?: string;
    password?: string;
}