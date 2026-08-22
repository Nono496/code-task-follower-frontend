import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, ContentChild, ElementRef, input, linkedSignal, signal, TemplateRef, viewChild, viewChildren } from '@angular/core';
import { Size } from '../size';
import { DiagramComponent } from '../diagram-component';

@Component({
  selector: 'app-tree-diagram-component',
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './tree-diagram-component.html',
  styleUrl: './tree-diagram-component.css',
  host: {
    '[style.--line-width]': 'lineWidth',
  }
})
export class TreeDiagramComponent extends DiagramComponent {
  // Tree basics
  nodes = input.required<TreeNode>();
  @ContentChild('node') customNode!: TemplateRef<unknown>;
  @ContentChild('line') customLine!: TemplateRef<unknown>;
  
  readonly lineWidth = 100;
  readonly minNodeWidth = 200;
  readonly nodeSpacing = 16 * 2;

  parentNode = viewChild<ElementRef<HTMLSpanElement>>('parent');
  parentNodeSize = signal<Size>({ width: 0, height: 0 });
  override childrenNodes = viewChildren(TreeDiagramComponent);

  direction = input<1 | -1>(-1);
  splitDirections = input<boolean>(true);

  getTotalContentCount(node: TreeNode): number {
    return node.children?.length ? node.children.map(c => this.getTotalContentCount(c)).reduce((c1, c2) => c1 + c2) : 1;
  }
  renderableNodes = computed(() => {
    let children = this.nodes().children ?? [];
    if (this.isDiagramRoot() && this.splitDirections() && (this.nodes().children?.length ?? 0) > 1) {
      const totalContentCount = children.reduce((count, node) => count + this.getTotalContentCount(node), 0);
      let currentCount = 0;
      const result = [[], []] as TreeNode[][];

      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        currentCount += this.getTotalContentCount(child);

        if (currentCount <= Math.ceil(totalContentCount / 2)) {
          result.at(0)!.push(child);
        } else {
          result.at(1)!.push(child);
        }
      }

      return result;
    }
    return [children];
  });

  renderedViewChildrenNodes = computed(() => {
    let children: TreeDiagramComponent[][];
    if (this.renderableNodes().length > 1) {
      children = [
        this.childrenNodes().filter(vc => this.renderableNodes()?.at(0)?.includes(vc.nodes())),
        this.childrenNodes().filter(vc => this.renderableNodes()?.at(1)?.includes(vc.nodes()))
      ];
    } else {
      children = [
        [...this.childrenNodes()]
      ];
    }
    
    return children;
  });

  viewChildrenTargetPositions = computed<number[][]>(() => this.renderedViewChildrenNodes().map(c => this.findChildNodeTargetPositionPercentagesFromParentCenter(c)));
  findChildNodeTargetPositionPercentagesFromParentCenter(childrenNodes: readonly TreeDiagramComponent[]) {
    let fullSize = this.orientation() === "vertical" ? this.hostSize().height : this.hostSize().width;

    let sizes = childrenNodes
      .map(c => this.orientation() === "vertical" ? c.hostSize().height : c.hostSize().width);

    let spacing = (fullSize - sizes.reduce((prev, curr) => prev + curr, 0)) / (sizes.length + 1);

    return sizes
      .map((c, i, a) => 
        (- fullSize / 2 + (i + 1) * spacing + c / 2 + a.reduce((position, childSize, index) => position + (index < i ? childSize : 0), 0))
      );
  };

  constructor() {
    super();
    const previousUpdateRootSizeSignals = this.updateRootSizeSignals;
    this.updateRootSizeSignals = (changed = true) => {
      if (changed) {
        this.parentNodeSize.set({
          height: this.parentNode()?.nativeElement.clientHeight || 0,
          width: this.parentNode()?.nativeElement.clientWidth || 0
        });
      }

      previousUpdateRootSizeSignals(changed);
    }

    this.setMissingProps(
      this.childrenNodes,
      this.contentSize = linkedSignal<Size>(() => {
        let result = { width: 0, height: 0 };
        if (this.availableSize().height === this.availableSize().width && this.availableSize().height === 0) return result;

        if (this.orientation() === 'vertical') {
          // 1. Portrait
          // 1.1 Height
          
          let verticalChildrenHeight = (children: readonly TreeDiagramComponent[]): number => {
            /* 1.11 If each child takes its needed space :
            childrenHeight += this.childrenNodes().reduce((prev, curr) => prev + (curr.contentHeight() ?? 0), 0)
            If all children take the same space because of flex : */
            let height = Math.max(
              children.reduce((prev, curr) => prev + (curr.contentSize().height ?? 0), 0)
            );

            // 1.12 Space between child nodes
            height += (this.childrenNodes().length - 1) * this.nodeSpacing;

            return height;
          }
          
          // 1.13 Choose parent height if larger
          result.height = Math.max(
            this.parentNodeSize().height,
            this.renderedViewChildrenNodes().reduce((max, childNodes) => Math.max(max, verticalChildrenHeight(childNodes)), 0),
          )
          
          // 1.2 Width
          result.width = 
          // Root
          Math.max(this.parentNodeSize().width, this.minNodeWidth) + 
          // Lines
          (this.nodes().children?.length ? this.renderedViewChildrenNodes().length * this.lineWidth : 0) + 
          // Children
          this.renderedViewChildrenNodes().reduce((prev, curr) => prev + curr.reduce((prev, curr) => Math.max(prev, curr.contentSize().width ?? 0), 0)!, 0)!
        } else {
          // 2. Landscape
          
          // 2.1 Width
          let horizontalChildrenWidth = (children: readonly TreeDiagramComponent[]): number => {
            let width = Math.max(
              children.reduce((prev, curr) => prev + (curr.contentSize().width ?? 0), 0),
            );
            width += (this.childrenNodes().length - 1) * this.nodeSpacing;

            return width;
          }
          
          result.width = Math.max(
            this.parentNodeSize().width,
            this.minNodeWidth,
            this.renderedViewChildrenNodes().reduce((max, childNodes) => Math.max(max, horizontalChildrenWidth(childNodes)), 0),
          )
          
          // 2.2 Height
          result.height = 
            this.parentNodeSize().height + 
            (this.nodes().children?.length ? this.renderedViewChildrenNodes().length * this.lineWidth : 0) + 
            this.renderedViewChildrenNodes().reduce((prev, curr) => prev + curr.reduce((prev, curr) => Math.max(prev, curr.contentSize().height ?? 0), 0)!, 0)!
        }
        return result;
      })
    );
  }
}

export type TreeNode = {
  data: any;
  children?: TreeNode[];
}