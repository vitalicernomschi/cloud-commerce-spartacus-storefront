import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[cxCmsSlot]'
})
export class CmsSlotDirective implements OnInit {
  @Input()
  cxCmsSlot: string | string[];

  constructor() {}

  ngOnInit() {
    const positions = [].concat(this.cxCmsSlot);
    console.log(positions);
  }
}
