import { Injectable } from '@angular/core';
import { Project, State, Task } from '../dtos/project';
import { ProjectService } from './project-service';

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
            id: 1,
            name: 'in dev',
            color: '#0000FF'
          },
          chronometer: {
            id: 0,
            seconds: 50,
            parts: [
              {
                id: 0,
                seconds: 23,
                description: 'This part took 23 seconds'
              },
              {
                id: 1,
                seconds: 27,
                description: 'This part took 27 seconds'
              },
            ]
          }
        },
        ],
        codes: [],
        commits: [],
        projects: [],
        state: {
          id: 1,
          name: 'in dev',
          color: '#0000FF'
        },
        chronometer: {
          id: 0,
          seconds: 50,
          parts: [
            {
              id: 0,
              seconds: 23,
              description: 'This part took 23 seconds'
            },
            {
              id: 1,
              seconds: 27,
              description: 'This part took 27 seconds'
            },
          ]
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
            state: {
              id: 1,
              name: 'in dev',
              color: '#0000FF'
            },
            chronometer: {
              id: 0,
              seconds: 501,
              parts: [
                {
                  id: 0,
                  seconds: 23,
                  description: 'This part took 23 seconds'
                },
                {
                  id: 1,
                  seconds: 501 - 23,
                  description: 'This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. '
                },
              ]
            },
            tags: [],
            dependencies: [],
            codes: [],
            commits: [],
            projects: [],
          },
        ],
        codes: [],
        commits: [],
        projects: [
          {
            id: 1,
            name: "Project 1",
            description: "This is a description",
            color: "#FF0000",
            branches: [],
            tags: [],
            tasks: []
          },
        ],
        state: {
          id: 1,
          name: 'in dev',
          color: '#0000FF'
        },
        chronometer: {
          id: 0,
          seconds: 501,
          parts: [
            {
              id: 0,
              seconds: 23,
              description: 'This part took 23 seconds'
            },
            {
              id: 1,
              seconds: 501 - 23,
              description: 'This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. This part took many seconds. '
            },
          ]
        },
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
          id: 1,
          name: 'in dev',
          color: '#0000FF'
        },
        chronometer: {
          id: 0,
          seconds: 50,
          parts: [
            {
              id: 0,
              seconds: 23,
              description: 'This part took 23 seconds'
            },
            {
              id: 1,
              seconds: 27,
              description: 'This part took 27 seconds'
            },
          ]
        }
      },
    ]
  }
}
