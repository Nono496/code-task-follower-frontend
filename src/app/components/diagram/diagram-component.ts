import { Directive, effect, ElementRef, inject, input, linkedSignal, model, output, Signal, signal, untracked } from "@angular/core";
import { TreeDiagramComponent } from "./tree-diagram-component/tree-diagram-component";
import { Size, sizeIsEqual } from "./size";


@Directive({
 host: {
    '[style.--host-height]': 'hostSize().height',
    '[style.--host-width]': 'hostSize().width',
    '(window:resize)': 'updateAllSizeSignals()' // Empty statement forces Angular to run change detection on resize
  }
})
export abstract class DiagramComponent {
  componentRef = inject(ElementRef);
  isDiagramRoot = input<boolean>(true);

  orientation = model<'horizontal' | 'vertical'>('horizontal');
  autoResize = input<boolean>(true);

  availableSize = signal<Size>({ width: 0, height: 0 }, {
    equal: sizeIsEqual
  });
  hostSize = linkedSignal<Size>(() => {
    return {
      height: Math.max(this.availableSize().height, this.contentSize().height),
      width: Math.max(this.availableSize().width, this.contentSize().width)
    };
  }, {
    equal: sizeIsEqual
  });

  contentSize: Signal<Size> = signal({ height: 0, width: 0 });

  childrenNodes: Signal<readonly TreeDiagramComponent[]> = signal([]);

  setMissingProps(childrenNodes: Signal<readonly TreeDiagramComponent[]>, contentSize: Signal<Size>) {
    this.childrenNodes = childrenNodes;
    this.contentSize = contentSize;
  }

  constructor() {
    effect(() => {
      if (this.hostSize()) {
        untracked(() => this.resize());
      }
    });
  }
  
  onResize = output<void>();
  resize() {
    this.updateAllSizeSignals(this.availableSizeChanged());
    
    const cont = this.componentRef!.nativeElement;
    if (!this.autoResize() || !this.isDiagramRoot()) {
      cont.style.minHeight = this.contentSize().height + 'px';
      cont.style.minWidth = this.contentSize().width + 'px';
      
      this.childrenNodes().forEach(cn => cn.resize());
      return;
    }
    
    let size = this.hostSize();

    cont.style.height = size?.height ? size.height + 'px' : '100%';
    cont.style.width = size?.width ? size.width + 'px' : '100%';
    
    this.onResize.emit();
    this.orientation.set(this.hostSize().height >= this.hostSize().width ? 'horizontal' : 'vertical');
    
    requestAnimationFrame(() => {
      this.updateAllSizeSignals();
      if (size === undefined || sizeIsEqual(size, { height: 0, width: 0 })) {
        this.resize();
        return;
      }
      
      size = this.contentSize();
      
      if (
        size.width > this.availableSize().width ||
        size.height > this.availableSize().height
      ) {
        size = this.hostSize()!;
        let zoom = Math.round(Math.min(this.availableSize().height / size.height, this.availableSize().width / size.width) * 1000) / 1000;
          
        if ((zoom + '') != cont.style.getPropertyValue('--zoom')) {
          // FIXME The translateY isn't correct
          this.componentRef.nativeElement.style.setProperty('--zoom', zoom + '');
          const translate = {
            height: this.availableSize().height / zoom / 2 - size.height / 2,
            width: this.availableSize().width / zoom / 2 - size.width / 2,
          }
          this.componentRef.nativeElement.style.setProperty('transform-origin', `top left`);
          this.componentRef.nativeElement.style.setProperty('transform', `scale(var(--zoom)) translateX(${translate.width}px) translateY(${translate.height}px)`);
        }
      }
      this.childrenNodes().forEach(cn => cn.resize());
    });
  }
  
  public updateAllSizeSignals = (changed = true) => {
    if (changed) {
          for (let index = 0; index < this.childrenNodes().length; index++) {
            const component = this.childrenNodes()[index] as DiagramComponent;
            component.updateAllSizeSignals();
          }

          this.updateRootSizeSignals();
      }
  }
  public updateRootSizeSignals = (changed = true) => {
      if (changed) {
        if(this.isDiagramRoot()) {
          this.availableSize.set({
              height: Math.round(this.componentRef.nativeElement.parentNode?.offsetHeight || 0),
              width: Math.round(this.componentRef.nativeElement.parentNode?.offsetWidth || 0)
          });
        } else {
          this.availableSize.set({
              height: Math.round(this.componentRef.nativeElement.offsetHeight || 0),
              width: Math.round(this.componentRef.nativeElement.offsetWidth || 0)
          });
        }
      }
  }

  availableSizeChanged() {
      const newAvailableSize: Size = {
          height: Math.round(this.componentRef.nativeElement.offsetHeight || 0),
          width: Math.round(this.componentRef.nativeElement.offsetWidth || 0)
      };

      return newAvailableSize.height != this.availableSize().height || newAvailableSize.width != this.availableSize().width;
  }
}