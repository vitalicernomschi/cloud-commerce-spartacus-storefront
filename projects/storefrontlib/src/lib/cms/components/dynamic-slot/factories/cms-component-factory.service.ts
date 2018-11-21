import {
  Injectable,
  ViewContainerRef,
  Injector,
  ComponentRef
} from '@angular/core';
import { ComponentMapperService } from '../../../services/component-mapper.service';
import { CmsComponentData } from '../../cms-component-data';
import { CmsService } from '../../../facade/cms.service';
import { AbstractCmsComponent } from '../../abstract-cms-component';

@Injectable()
export class CmsComponentFactoryService {
  constructor(
    protected componentMapper: ComponentMapperService,
    protected cmsService: CmsService
  ) {}

  create(vcr: ViewContainerRef, component): ComponentRef<any> {
    const factory = this.componentMapper.getComponentFactoryByCode(
      component.typeCode
    );
    let cmpRef: ComponentRef<any>;
    if (factory) {
      cmpRef = vcr.createComponent(
        factory,
        undefined,
        this.getInjectorForComponent(vcr, component)
      );

      if (cmpRef.instance instanceof AbstractCmsComponent) {
        cmpRef.instance.onCmsComponentInit(
          component.uid,
          component.contextParameters
        );
      }
    }

    return cmpRef;
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
