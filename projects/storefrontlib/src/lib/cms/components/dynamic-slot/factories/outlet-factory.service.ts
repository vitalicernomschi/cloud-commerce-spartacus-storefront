import { Injectable, ViewContainerRef } from '@angular/core';
import { OutletPosition } from 'projects/storefrontlib/src/lib/outlet/outlet.model';
import { OutletService } from 'projects/storefrontlib/src/lib/outlet';

@Injectable()
export class OutletFactoryService {
  constructor(protected outletService: OutletService) {}

  wrap(outletRef: string, viewContainer: ViewContainerRef, callback: Function) {
    this.renderOutlet(outletRef, viewContainer, OutletPosition.BEFORE);

    if (this.hasTemplate(outletRef)) {
      this.renderOutlet(outletRef, viewContainer);
    } else {
      callback();
    }

    this.renderOutlet(outletRef, viewContainer, OutletPosition.AFTER);
  }

  protected renderOutlet(
    outlet: string,
    viewContainer: ViewContainerRef,
    position: OutletPosition = OutletPosition.REPLACE
  ) {
    const template = this.outletService.get(outlet, position);
    if (template || position === OutletPosition.REPLACE) {
      viewContainer.createEmbeddedView(template, {
        $implicit: this.getContext(viewContainer)
      });
    }
  }

  protected hasTemplate(
    outlet: string,
    position: OutletPosition = OutletPosition.REPLACE
  ): boolean {
    return !!this.outletService.get(outlet, position);
  }

  protected getContext(viewContainer: ViewContainerRef) {
    const ctx = (<any>viewContainer.injector).view.context;
    // the context might already be given $implicit
    // by a parent *ngIf or *ngFor
    return ctx.$implicit || ctx;
  }
}
