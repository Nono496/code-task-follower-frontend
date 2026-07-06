import * as z from "zod";
import { CrudItem } from "../services/crud-service";

export const taskSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, {error: 'Too short'}),
    get state() { return stateSchema },
    get chronometer() { return chronometerSchema.optional() },
    get tags() { return z.array(tagSchema).optional() },
    get dependencies() { return z.array(taskSchema).optional() },
    get projects() { return z.array(projectSchema).optional() },
    get commits() { return z.array(commitSchema).optional() },
    get codes() { return z.array(codeSchema).optional() },
});
export type Task = z.infer<typeof taskSchema> & CrudItem;

export const projectSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    description: z.string().optional(),
    get states() { return z.array(stateSchema).optional() },
    get tasks() { return z.array(taskSchema).optional() },
    get branches() { return z.array(branchSchema).optional() },
});
export type Project = z.infer<typeof projectSchema> & CrudItem;

export const tagSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});
export type Tag = z.infer<typeof tagSchema> & CrudItem;

export const branchSchema = z.object({
    id: z.number().optional(),
    repositoryName: z.string(),
    branchName: z.string()
});
export type Branch = z.infer<typeof branchSchema> & CrudItem;

export const stateSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});
export type State = z.infer<typeof stateSchema> & CrudItem;

export const commitSchema = z.object({
    id: z.number().optional(),
    hash: z.string(),
    tasks: z.array(taskSchema)
});
export type Commit = z.infer<typeof commitSchema> & CrudItem;

export const codeSchema = z.object({
    id: z.number().optional(),
    branch: branchSchema,
    classPath: z.string()
});
export type Code = z.infer<typeof codeSchema> & CrudItem;

export const chronometerPartSchema = z.object({
    id: z.number().optional(),
    seconds: z.number(),
    description: z.string()
});
export type ChronometerPart = z.infer<typeof chronometerPartSchema> & CrudItem;

export const chronometerSchema = z.object({
    id: z.number().optional(),
    seconds: z.number(),
    parts: z.array(chronometerPartSchema)
});
export type Chronometer = z.infer<typeof chronometerSchema> & CrudItem;

export const userSchema = {
    id: z.number().optional(),
    username: z.string(),
    password: z.string()
}
export type User = z.infer<typeof userSchema> & CrudItem;