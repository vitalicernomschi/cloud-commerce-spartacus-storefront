import {
  Injectable,
  ViewContainerRef,
  Injector,
  ComponentRef
} from '@angular/core';
import { ComponentMapperService } from '../../services';
import { CmsComponentData } from '../cms-component-data';
import { CmsService } from '../../facade/cms.service';

@Injectable()
export class CmsComponentFactoryService {
  constructor(
    private componentMapper: ComponentMapperService,
    protected cmsService: CmsService
  ) {}

  create(vcr: ViewContainerRef, component): ComponentRef<any> {
    const factory = this.componentMapper.getComponentFactoryByCode(
      component.typeCode
    );

    if (factory) {
      return vcr.createComponent(
        factory,
        undefined,
        this.getInjectorForComponent(vcr, component)
      );
    }
  }

  private getInjectorForComponent(vcr: ViewContainerRef, component) {
    return Injector.create({
      providers: [
        {
          provide: CmsComponentData,
          useValue: this.getCmsDataForComponent(component)
        }
      ],
      parent: vcr.injector
    });
  }

  private getCmsDataForComponent(component): CmsComponentData {
    return {
      uid: component.uid,
      contextParameters: component.contextParameters,
      data$: this.cmsService.getComponentData(component.uid)
    };
  }
}
