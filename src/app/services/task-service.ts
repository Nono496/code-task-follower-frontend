import { Injectable } from '@angular/core';
import { State, Task } from '../dtos/project';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  getStates(): State[] {
    return [
      {
        id: 0,
        name: "TODO",
        color: "#00FF00"
      },
      {
        id: 1,
        name: "in dev",
        color: "#0000FF"
      },
    ]
  }

  getTasks(): Task[] {
    return [
      {
        id: 1,
        name: "Task 1",
        tags: [],
        dependencies: [
          {
          id: 3,
          name: "Task 3",
          tags: [],
          dependencies: [],
          codes: [],
          commits: [],
          projects: [],
          state: {
            id: 0,
            name: 'in dev',
            color: '#0000FF'
          }
        },
        ],
        codes: [],
        commits: [],
        projects: [],
        state: {
          id: 0,
          name: 'in dev',
          color: '#0000FF'
        }
      },
      {
        id: 2,
        name: "Task 2",
        tags: [
          {
            id: 0,
            name: "blu",
            color: '#689874'
          },
          {
            id: 1,
            name: "bla",
            color: '#611874'
          },
        ],
        dependencies: [
          {
            id: 1,
            name: "Task 1",
            tags: [],
            dependencies: [],
            codes: [],
            commits: [],
            projects: [],
            state: {
              id: 0,
              name: 'in dev',
              color: '#0000FF'
            }
          },
        ],
        codes: [],
        commits: [],
        projects: [],
        state: {
          id: 0,
          name: 'in dev',
          color: '#0000FF'
        }
      },
      {
        id: 3,
        name: "Task 3",
        tags: [],
        dependencies: [],
        codes: [],
        commits: [],
        projects: [],
        state: {
          id: 0,
          name: 'in dev',
          color: '#0000FF'
        }
      },
    ]
  }
}
