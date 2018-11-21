import { Injectable, ViewContainerRef } from '@angular/core';
import { ComponentMapperService } from '../../../services';
import { CmsService } from '../../../facade/cms.service';
import { CmsComponentFactoryService } from './cms-component-factory.service';

@Injectable()
export class ComponentFactoryService {
  constructor(
    private componentMapper: ComponentMapperService,
    protected cmsService: CmsService,
    protected cmsComponentFactory: CmsComponentFactoryService
  ) {}

  create(vcr: ViewContainerRef, component): any {
    if (this.componentMapper.isWebComponent(component.typeCode)) {
    } else {
      return this.cmsComponentFactory.create(vcr, component);
    }
  }
}
