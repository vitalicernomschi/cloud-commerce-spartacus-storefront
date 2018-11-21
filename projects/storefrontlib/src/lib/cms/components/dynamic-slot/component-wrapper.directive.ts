import {
  Directive,
  ViewContainerRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ComponentRef,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { ComponentFactoryService } from './factories/component-factory.service';

@Directive({
  selector: '[cxComponentWrapper]'
})
export class ComponentWrapperDirective implements AfterViewInit, OnDestroy {
  @Input()
  componentType: string;
  @Input()
  componentUid: string;
  @Input()
  componentCssClass: string;
  @Input()
  contextParameters: any;

  cmpRef: ComponentRef<any>;
  webElement: any;

  constructor(
    private vcr: ViewContainerRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private componentFactory: ComponentFactoryService
  ) {}

  private cmpRefs: ComponentRef<any>[] = [];

  ngAfterViewInit() {
    const comp = this.componentFactory.create(this.renderer, this.vcr, {
      typeCode: this.componentType,
      uid: this.componentUid,
      contextParameters: this.contextParameters
    });
    this.cmpRefs.push(comp);
    this.cd.detectChanges();
  }

  // private launchComponent() {
  //   const factory = this.componentMapper.getComponentFactoryByCode(
  //     this.componentType
  //   );

  //   if (factory) {
  //     this.cmpRef = this.vcr.createComponent(
  //       factory,
  //       undefined,
  //       this.getInjectorForComponent()
  //     );

  //     // TODO: Remove after AbstractCmsComponent will be removed
  //     const instance: AbstractCmsComponent = this.cmpRef.instance;
  //     if (instance.onCmsComponentInit) {
  //       instance.onCmsComponentInit(this.componentUid, this.contextParameters);
  //     } else {
  //       this.cd.detectChanges();
  //     }
  //   }
  // }

  // private async launchWebComponent() {
  //   const elementName = await this.componentMapper.initWebComponent(
  //     this.componentType,
  //     this.renderer
  //   );

  //   if (elementName) {
  //     this.webElement = this.renderer.createElement(elementName);

  //     this.webElement.cxApi = {
  //       ...this.injector.get(CxApiService),
  //       CmsComponentData: this.getCmsDataForComponent()
  //     };

  //     this.renderer.appendChild(
  //       this.vcr.element.nativeElement.parentElement,
  //       this.webElement
  //     );
  //   }
  // }

  // private getCmsDataForComponent(): CmsComponentData {
  //   return {
  //     uid: this.componentUid,
  //     contextParameters: this.contextParameters,
  //     data$: this.cmsService.getComponentData(this.componentUid)
  //   };
  // }

  // private getInjectorForComponent() {
  //   return Injector.create({
  //     providers: [
  //       {
  //         provide: CmsComponentData,
  //         useValue: this.getCmsDataForComponent()
  //       }
  //     ],
  //     parent: this.injector
  //   });
  // }

  ngOnDestroy() {
    this.cmpRefs.filter(ref => !!ref).forEach(ref => {
      if (ref instanceof ComponentRef) {
        ref.destroy();
      } else {
        this.renderer.removeChild(
          this.vcr.element.nativeElement.parentElement,
          ref
        );
      }
    });
  }
  // ngOnDestroy() {
  //   if (this.cmpRef) {
  //     this.cmpRef.destroy();
  //   }
  //   if (this.webElement) {
  //     this.renderer.removeChild(
  //       this.vcr.element.nativeElement.parentElement,
  //       this.webElement
  //     );
  //   }
  // }
}
