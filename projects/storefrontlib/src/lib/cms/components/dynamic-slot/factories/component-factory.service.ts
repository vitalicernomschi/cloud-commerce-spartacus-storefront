import { Injectable, ViewContainerRef, Renderer2 } from '@angular/core';
import { ComponentMapperService } from '../../../services';
import { CmsService } from '../../../facade/cms.service';
import { CmsComponentFactoryService } from './cms-component-factory.service';
import { WebComponentFactoryService } from './web-component-factory.service';
import { CmsComponentData } from '../../cms-component-data';
import { OutletFactoryService } from './outlet-factory.service';

@Injectable()
export class ComponentFactoryService {
  constructor(
    private componentMapper: ComponentMapperService,
    protected cmsService: CmsService,
    protected cmsComponentFactory: CmsComponentFactoryService,
    protected webComponentFactory: WebComponentFactoryService,
    protected outletFactory: OutletFactoryService
  ) {}

  create(renderer: Renderer2, vcr: ViewContainerRef, component): any {
    this.outletFactory.wrap(component.typeCode, vcr, () => {
      // call back that will be called in case the component is not replaced by an outlet
      const componentData = this.getCmsDataForComponent(component);
      if (this.componentMapper.isWebComponent(component.typeCode)) {
        return this.webComponentFactory.create(renderer, vcr, componentData);
      } else {
        return this.cmsComponentFactory.create(vcr, componentData);
      }
    });
  }

  private getCmsDataForComponent(component): CmsComponentData {
    return {
      uid: component.uid,
      type: component.typeCode,
      contextParameters: component.contextParameters,
      data$: this.cmsService.getComponentData(component.uid)
    };
  }
}
