import { Injectable, Renderer2, ViewContainerRef } from '@angular/core';
import { ComponentMapperService } from '../../../services/component-mapper.service';
import { CxApiService } from '../../../../cx-api/cx-api.service';
import { CmsComponentData } from '../../cms-component-data';
import { CmsService } from '../../../facade/cms.service';

@Injectable()
export class WebComponentFactoryService {
  constructor(
    protected componentMapper: ComponentMapperService,
    protected cmsService: CmsService
  ) {}

  async create(renderer: Renderer2, vcr: ViewContainerRef, component) {
    const elementName = await this.componentMapper.initWebComponent(
      component.componentType,
      renderer
    );
    let webElement;
    if (elementName) {
      webElement = renderer.createElement(elementName);

      webElement.cxApi = {
        ...vcr.injector.get(CxApiService),
        CmsComponentData: this.getCmsDataForComponent(component)
      };

      renderer.appendChild(vcr.element.nativeElement.parentElement, webElement);
    }
    return webElement;
  }

  private getCmsDataForComponent(component): CmsComponentData {
    return {
      uid: component.uid,
      contextParameters: component.contextParameters,
      data$: this.cmsService.getComponentData(component.uid)
    };
  }
}
