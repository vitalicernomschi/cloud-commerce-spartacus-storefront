import {
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef,
  OnDestroy,
  ComponentRef,
  Renderer2
} from '@angular/core';
import { CmsService } from '../../facade/cms.service';
import { ComponentFactoryService } from './factories/component-factory.service';

@Directive({
  selector: '[cxCmsSlot]'
})
export class CmsSlotDirective implements OnInit, OnDestroy {
  @Input()
  cxCmsSlot: string | string[];

  private cmpRefs: ComponentRef<any>[] = [];

  constructor(
    protected viewContainer: ViewContainerRef,
    protected cd: ChangeDetectorRef,
    protected cmsService: CmsService,
    protected componentFactory: ComponentFactoryService,
    protected renderer: Renderer2
  ) {}

  ngOnInit() {
    const positions = [].concat(this.cxCmsSlot);
    positions.forEach(position => this.renderSlot(position));
  }

  protected renderSlot(position) {
    this.cmsService.getContentSlot(position).subscribe((components: any[]) => {
      components.forEach(component => this.renderComponents(component));
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
      ref.destroy();
    });
  }
}
