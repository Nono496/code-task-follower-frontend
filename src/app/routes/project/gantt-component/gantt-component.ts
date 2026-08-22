import { Component, computed, input, viewChildren } from '@angular/core';
import { Task } from '../../../dtos/zod-schemas';
import { TreeDiagramComponent, TreeNode } from '../../../components/diagram/tree-diagram-component/tree-diagram-component';
import { Card } from 'primeng/card';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-gantt-component',
  imports: [TreeDiagramComponent, Card, JsonPipe],
  templateUrl: './gantt-component.html',
  styleUrl: './gantt-component.css',
})
export class GanttComponent {
  tasks = input.required<Task[]>();
  dependencyTrees = computed<(TreeNode & { data: { projectId: number, nodes: TreeNode } })[]>(() => {
    const trees: TreeNode[] & { data: { projectId: number, nodes: TreeNode }, partOfTree: boolean }[] = this.tasks().map(t => ({ data: {
      projectId: t.projectId,
      nodes: {
        data: t,
        children: []
      }
    }, children: [], partOfTree: true }));

    for (let treeToFillIndex = 0; treeToFillIndex < this.tasks().length; treeToFillIndex++) {
      const tree = trees[treeToFillIndex];
      
      for (let treeDependencyIndex = 0; treeDependencyIndex < this.tasks().length; treeDependencyIndex++) {
        const dependency = trees[treeDependencyIndex];
        
        if (tree.data.nodes.data.dependencies?.includes(dependency.data.nodes.data.id)) {
          dependency.partOfTree = false;
          
          if (tree.data.projectId === dependency.data.projectId) {
            tree.data.nodes.children!.push(dependency.data.nodes)
          } else {
            tree.children!.push(dependency);
          }
        }
      }
    }
    
    return trees.filter((t: Partial<{ data: Task, partOfTree: boolean }>) => t.partOfTree);
  });
}
