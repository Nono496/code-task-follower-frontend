import { Injectable } from '@angular/core';
import { Project } from '../dtos/project';
import { TaskService } from './task-service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  getProject(projectId: number) {
    return this.getProjects().at(1);
  }

  getProjects(): Project[] {
    return [
      {
        id: 1,
        name: "Project 1",
        description: "This is a description",
        color: "#FF0000",
        branches: [],
        tags: [],
        tasks: []
      },
      {
        id: 2,
        name: "Project 2",
        description: "This is a description",
        color: "#00FF00",
        branches: [],
        tags: [
          {
            id: 0,
            name: "Tag 0",
            color: "#0FF000"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          },
          {
            id: 1,
            name: "Tag 1",
            color: "#000FF0"
          }
        ],
        tasks: new TaskService().getTasks()
      }
    ]
  }
}
