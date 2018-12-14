import { Injectable } from '@angular/core';
import { PWAModuleConfig } from '../pwa.module-config';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class AddToHomeScreenService {
  private deferredEvent: any;

  private canPrompt = new BehaviorSubject<boolean>(false);

  canPrompt$: Observable<any> = this.canPrompt.asObservable();

  constructor(
    private config: PWAModuleConfig,
    private globalMessageService: GlobalMessageService
  ) {
    if (this.config.pwa.addToHomeScreen) {
      this.init();
    }
  }

  init() {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.deferredEvent = event;
      this.enableAddToHomeScreen();
    });

    window.addEventListener('appinstalled', () => {
      this.globalMessageService.add({
        type: GlobalMessageType.MSG_TYPE_CONFIRMATION,
        text: 'SAP Storefront was added to your home screen'
      });

      this.disableAddToHomeScreen();
      this.deferredEvent = null;
    });
  }

  enableAddToHomeScreen(): void {
    this.canPrompt.next(true);
  }

  disableAddToHomeScreen(): void {
    this.canPrompt.next(false);
  }

  firePrompt(): void {
    if (this.deferredEvent) {
      this.deferredEvent.prompt();
    }
  }
}
