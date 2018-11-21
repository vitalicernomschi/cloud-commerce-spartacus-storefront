import { Injectable, Type, ComponentFactoryResolver } from '@angular/core';
import { CmsModuleConfig } from '../cms-module-config';

@Injectable()
export class ComponentMapperService {
  missingComponents = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private config: CmsModuleConfig
  ) {}

  /**
   * @desc
   * returns a web component for the CMS typecode.
   *
   * The mapping of CMS components to web componetns requires a mapping.
   * This is configurable when the module is loaded.
   *
   * For example:
   *
   *  {
   *      'CMSLinkComponent': 'LinkComponent',
   *      'SimpleResponsiveBannerComponent': 'SimpleResponsiveBannerComponent',
   *      [etc.]
   *  }
   *
   * The type codes are dynamic since they depend on the implementation.
   * Customer will add, extend or ingore standard components.
   *
   * @param typeCode the component type
   */
  public getType(typeCode: string) {
    const alias = this.config.cmsComponentMapping[typeCode];
    if (!alias) {
      if (this.missingComponents.indexOf(typeCode) === -1) {
        this.missingComponents.push(typeCode);
        console.warn(
          'No component implementation found for the CMS component type',
          typeCode,
          '.\n',
          'Make sure you implement a component and register it in the mapper.'
        );
      }
    }
    return alias;
  }

  getFactoryEntryByCode(typeCode: string) {
    const alias = this.getType(typeCode);
    if (!alias) {
      return;
    }
    const factoryEntries = Array.from(
      this.componentFactoryResolver['_factories'].entries()
    );

    return factoryEntries.find(([, value]: any) => value.selector === alias);
  }

  getComponentTypeByCode(typeCode: string): Type<any> {
    const factoryEntry = this.getFactoryEntryByCode(typeCode);
    return factoryEntry ? factoryEntry[0] : null;
  }

  getComponentFactoryByCode(typeCode: string): any {
    const factoryEntry = this.getFactoryEntryByCode(typeCode);
    return factoryEntry ? factoryEntry[1] : null;
  }

  isWebComponent(typeCode: string): boolean {
    return (this.getType(typeCode) || '').includes('#');
  }
}
