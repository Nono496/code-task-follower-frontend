import { Component } from '@angular/core';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { DataView } from 'primeng/dataview';
import { Project } from '../../../../dtos/zod-schemas';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-interface-preferences-settings',
  imports: [RadioButton, FormsModule, Card, DataView, NgStyle],
  templateUrl: './interface-preferences-settings.html',
  styleUrl: './interface-preferences-settings.css',
})
export class InterfacePreferencesSettings {
  projectList: string = 'vertical_list';

  projects_example: Project[] = [
    {
      name: "Project 1",
      description: "Project 1 description",
      color: "#34ebb7",
      id: 0
    },
    {
      name: "Project 2",
      description: "Project 2 description",
      color: "#34ebb7",
      id: 1
    },
    {
      name: "Project 3",
      description: "Project 3 description",
      color: "#34ebb7",
      id: 2
    },
    {
      name: "Project 4",
      description: "Project 4 description",
      color: "#34ebb7",
      id: 3
    },
    {
      name: "Project 5",
      description: "Project 5 description",
      color: "#34ebb7",
      id: 4
    }
  ];
}
