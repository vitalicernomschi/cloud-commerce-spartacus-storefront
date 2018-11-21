import {
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef,
  OnDestroy,
  ComponentRef
} from '@angular/core';
import { CmsService } from '../../facade/cms.service';
import { CmsComponentFactoryService } from './cms-component-factory.service';

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
    protected cmsComponentFactory: CmsComponentFactoryService
  ) {}

  ngOnInit() {
    this.getPositions().forEach(position => this.renderSlot(position));
  }

  protected renderSlot(position) {
    this.cmsService.getContentSlot(position).subscribe((components: any[]) => {
      components.forEach(component => this.renderComponents(component));
    });
  }

  protected renderComponents(component) {
    this.cmpRefs.push(
      this.cmsComponentFactory.create(this.viewContainer, component)
    );
    this.cd.detectChanges();
  }

  protected getPositions(): string[] {
    return [].concat(this.cxCmsSlot);
  }

  ngOnDestroy() {
    this.cmpRefs.filter(ref => !!ref).forEach(ref => {
      ref.destroy();
    });
  }
}
