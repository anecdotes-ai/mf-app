import { Component, Input, Optional, OnChanges } from '@angular/core';
import {
  GlobalLoaderModalWindowInputKeys,
  GlobalLoaderModalWindowSharedContext,
  GlobalLoaderModalWindowSharedContextInputKeys
} from 'core/modules/modals/components/global-loader-modal/constants';
import { ModalWindowService } from '../../services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-global-loader-modal',
  templateUrl: './global-loader-modal.component.html',
  styleUrls: ['./global-loader-modal.component.scss']
})
export class GlobalLoaderModalComponent implements OnChanges {
  private contextData: GlobalLoaderModalWindowSharedContext;

  @Input(GlobalLoaderModalWindowInputKeys.description)
  description: string;

  @Input(GlobalLoaderModalWindowInputKeys.loadingHandlerFunction)
  loadingHandlerFunction: () => Promise<void>;

  @Input(GlobalLoaderModalWindowInputKeys.successWindowSwitcherId)
  successWindowSwitcherId: string;

  @Input(GlobalLoaderModalWindowInputKeys.errorWindowSwitcherId)
  errorWindowSwitcherId: string;
  
  constructor(
    private modalWindowService: ModalWindowService,
    @Optional() private switcher: ComponentSwitcherDirective) { }

  async ngOnChanges(): Promise<void> {
    await this.getSwitcherContextData();
    this.loading();
  }

  private async loading(): Promise<void> {
    try {
      await this.loadingHandlerFunction();
      if (this.successWindowSwitcherId) {
        this.switcher.goById(this.successWindowSwitcherId);
      } else {
        this.modalWindowService.close();
      }
    } catch (e) {
      if (this.errorWindowSwitcherId) {
        this.switcher.goById(this.errorWindowSwitcherId);
      }
    }
  }

  private async getSwitcherContextData(): Promise<void> {
    this.contextData = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();
    if (this.contextData) {
      this.description = this.description
        ? this.description
        : this.contextData[GlobalLoaderModalWindowSharedContextInputKeys.description];
      this.loadingHandlerFunction = this.loadingHandlerFunction
        ? this.loadingHandlerFunction
        : (this.contextData[GlobalLoaderModalWindowSharedContextInputKeys.loadingHandlerFunction] as any);
      this.successWindowSwitcherId = this.successWindowSwitcherId
        ? this.successWindowSwitcherId
        : this.contextData[GlobalLoaderModalWindowSharedContextInputKeys.successWindowSwitcherId];
      this.errorWindowSwitcherId = this.errorWindowSwitcherId
        ? this.errorWindowSwitcherId
        : this.contextData[GlobalLoaderModalWindowSharedContextInputKeys.errorWindowSwitcherId];
    }
  }
}
