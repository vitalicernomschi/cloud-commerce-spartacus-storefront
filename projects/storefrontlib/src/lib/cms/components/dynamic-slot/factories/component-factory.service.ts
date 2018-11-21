import { Injectable, ViewContainerRef, Renderer2 } from '@angular/core';
import { ComponentMapperService } from '../../../services';
import { CmsService } from '../../../facade/cms.service';
import { CmsComponentFactoryService } from './cms-component-factory.service';
import { WebComponentFactoryService } from './web-component-factory.service';

@Injectable()
export class ComponentFactoryService {
  constructor(
    private componentMapper: ComponentMapperService,
    protected cmsService: CmsService,
    protected cmsComponentFactory: CmsComponentFactoryService,
    protected webComponentFactory: WebComponentFactoryService
  ) {}

  create(renderer: Renderer2, vcr: ViewContainerRef, component): any {
    if (this.componentMapper.isWebComponent(component.typeCode)) {
      return this.webComponentFactory.create(renderer, vcr, component);
    } else {
      return this.cmsComponentFactory.create(vcr, component);
    }
  }
}
