import {
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';
import { CmsService } from '../../facade/cms.service';
import { CmsComponentFactoryService } from './cms-component-factory.service';

@Directive({
  selector: '[cxCmsSlot]'
})
export class CmsSlotDirective implements OnInit {
  @Input()
  cxCmsSlot: string | string[];

  constructor(
    protected viewContainer: ViewContainerRef,
    protected cmsService: CmsService,
    protected cmsComponentFactoryService: CmsComponentFactoryService
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
    this.cmsComponentFactoryService.create(this.viewContainer, component);
  }
}
