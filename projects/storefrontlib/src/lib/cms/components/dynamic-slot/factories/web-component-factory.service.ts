import {
  Injectable,
  Renderer2,
  ViewContainerRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ComponentMapperService } from '../../../services/component-mapper.service';
import { CxApiService } from '../../../../cx-api/cx-api.service';
import { CmsComponentData } from '../../cms-component-data';
import { CmsService } from '../../../facade/cms.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable()
export class WebComponentFactoryService {
  private loadedWebComponents: { [path: string]: any } = {};

  constructor(
    protected componentMapper: ComponentMapperService,
    protected cmsService: CmsService,
    @Inject(PLATFORM_ID) private platform: any,
    @Inject(DOCUMENT) private document: any
  ) {}

  async create(
    renderer: Renderer2,
    vcr: ViewContainerRef,
    componentData: CmsComponentData
  ) {
    const elementName = await this.initWebComponent(
      componentData.type,
      renderer
    );
    let webElement;
    if (elementName) {
      webElement = renderer.createElement(elementName);

      webElement.cxApi = {
        ...vcr.injector.get(CxApiService),
        CmsComponentData: componentData
      };

      renderer.appendChild(vcr.element.nativeElement.parentElement, webElement);
    }
    return webElement;
  }

  protected initWebComponent(
    componentType: string,
    renderer: Renderer2
  ): Promise<string> {
    return new Promise(resolve => {
      const [path, selector] = this.componentMapper
        .getType(componentType)
        .split('#');

      let script = this.loadedWebComponents[path];

      if (!script) {
        script = renderer.createElement('script');
        this.loadedWebComponents[path] = script;
        script.setAttribute('src', path);
        renderer.appendChild(this.document.body, script);

        if (isPlatformBrowser(this.platform)) {
          script.onload = () => {
            script.onload = null;
          };
        }
      }

      if (script.onload) {
        // If script is still loading (has onload callback defined)
        // add new callback and chain it with the existing one.
        // Needed to support loading multiple components from one script
        const chainedOnload = script.onload;
        script.onload = () => {
          chainedOnload();
          resolve(selector);
        };
      } else {
        resolve(selector);
      }
    });
  }
}
