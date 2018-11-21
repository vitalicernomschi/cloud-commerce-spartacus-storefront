import { CmsComponentFactoryService } from './cms-component-factory.service';
import { WebComponentFactoryService } from './web-component-factory.service';
import { ComponentFactoryService } from './component-factory.service';
import { OutletFactoryService } from './outlet-factory.service';

export const factories = [
  ComponentFactoryService,
  CmsComponentFactoryService,
  WebComponentFactoryService,
  OutletFactoryService
];
