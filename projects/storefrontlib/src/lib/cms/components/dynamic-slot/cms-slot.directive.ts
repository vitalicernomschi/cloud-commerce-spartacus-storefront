import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[cxCmsSlot]'
})
export class CmsSlotDirective implements OnInit {
  @Input()
  cxCmsSlot: string;

  constructor() {}

  ngOnInit() {
    console.log(this.cxCmsSlot);
  }
}
