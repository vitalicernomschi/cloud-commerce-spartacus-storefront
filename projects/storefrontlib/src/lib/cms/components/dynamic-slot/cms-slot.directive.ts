import {
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef,
  OnDestroy,
  ComponentRef,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { CmsService } from '../../facade/cms.service';
import { ComponentFactoryService } from './factories/component-factory.service';

import { OutletService } from '../../../outlet';
import { OutletFactoryService } from './factories/outlet-factory.service';

@Directive({
  selector: '[cxCmsSlot]'
})
export class CmsSlotDirective implements OnInit, OnDestroy {
  @Input()
  cxCmsSlot: string | string[];

  private cmpRefs: ComponentRef<any>[] = [];

  constructor(
    protected cd: ChangeDetectorRef,
    protected renderer: Renderer2,
    protected viewContainer: ViewContainerRef,
    protected cmsService: CmsService,
    protected componentFactory: ComponentFactoryService,
    protected outletFactory: OutletFactoryService
  ) {}

  ngOnInit() {
    const positions = [].concat(this.cxCmsSlot);
    positions.forEach(position => this.renderSlot(position));
  }

  protected renderSlot(position) {
    this.cmsService.getContentSlot(position).subscribe((components: any[]) => {
      this.outletFactory.wrap(position, this.viewContainer, () =>
        components.forEach(component => this.renderComponents(component))
      );
    });
  }

  protected renderComponents(component) {
    this.cmpRefs.push(
      this.componentFactory.create(this.renderer, this.viewContainer, component)
    );
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.cmpRefs.filter(ref => !!ref).forEach(ref => {
      if (ref instanceof ComponentRef) {
        ref.destroy();
      } else {
        this.renderer.removeChild(
          this.viewContainer.element.nativeElement.parentElement,
          ref
        );
      }
    });
  }
}
