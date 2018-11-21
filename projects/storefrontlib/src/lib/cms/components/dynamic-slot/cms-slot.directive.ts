import { Directive, Input, OnInit } from '@angular/core';
import { CmsService } from '../../facade/cms.service';

@Directive({
  selector: '[cxCmsSlot]'
})
export class CmsSlotDirective implements OnInit {
  @Input()
  cxCmsSlot: string | string[];

  constructor(protected cmsService: CmsService) {}

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
    console.log('render component', component);
  }
}
