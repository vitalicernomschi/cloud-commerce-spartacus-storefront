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

  create(
    vcr: ViewContainerRef,
    componentData: CmsComponentData
  ): ComponentRef<any> {
    const factory = this.componentMapper.getComponentFactoryByCode(
      componentData.type
    );
    let cmpRef: ComponentRef<any>;
    if (factory) {
      cmpRef = vcr.createComponent(
        factory,
        undefined,
        this.getInjectorForComponent(vcr, componentData)
      );

      if (cmpRef.instance instanceof AbstractCmsComponent) {
        cmpRef.instance.onCmsComponentInit(
          componentData.uid,
          componentData.contextParameters
        );
      }
    }

    return cmpRef;
  }

  private getInjectorForComponent(
    vcr: ViewContainerRef,
    componentData: CmsComponentData
  ) {
    return Injector.create({
      providers: [
        {
          provide: CmsComponentData,
          useValue: componentData
        }
      ],
      parent: vcr.injector
    });
  }
}
