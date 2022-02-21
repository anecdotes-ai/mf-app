import {
  StatusType,
  StatusModalWindowInputKeys,
  StatusModalWindowSharedContext,
  CustomStatusModalButton,
  CustomStatusModalButtons,
} from './constants';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Component, EventEmitter, Input, OnInit, Optional, Output, ChangeDetectorRef } from '@angular/core';
import { ModalWindowService } from '../../services';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-status-window-modal',
  templateUrl: './status-window-modal.component.html',
  styleUrls: ['./status-window-modal.component.scss'],
})
export class StatusWindowModalComponent implements OnInit {
  private statusModalWindowSharedContext: StatusModalWindowSharedContext;
  readonly statusTypesEnum = StatusType;

  @Input(StatusModalWindowInputKeys.statusType)
  statusType: StatusType = StatusType.SUCCESS;

  @Input(StatusModalWindowInputKeys.translationKey)
  translationKey: string;

  @Input(StatusModalWindowInputKeys.closeModalOnClick)
  closeModalOnClick = true;

  @Input(StatusModalWindowInputKeys.customButtons)
  customButtons: CustomStatusModalButtons;

  @Input(StatusModalWindowInputKeys.withDescriptionText)
  withDescriptionText = true;

  @Output()
  closeClick = new EventEmitter(true);

  constructor(
    private modalWindowService: ModalWindowService,
    @Optional() private switcher: ComponentSwitcherDirective,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.switcher) {
      await this.getSwitcherContextData();
    }
  }

  customButtonHandlerExecute(button: CustomStatusModalButton): void {
    if (button.nextModalId) {
      this.switcher.goById(button.nextModalId);
    } else {
      this.modalWindowService.close();
    }
  }

  close(): void {
    if (this.closeModalOnClick && !this.customButtons) {
      this.modalWindowService.close();
    } else if (this.switcher) {
      this.switcher.goBack();
    }

    this.closeClick.emit();
  }

  buildTranslationKey(relativeKey: string): string {
    if (this.statusModalWindowSharedContext?.translationKey && !this.translationKey) {
      return `${this.statusModalWindowSharedContext.translationKey}.${this.getPartialTranslationKey()}.${relativeKey}`;
    }

    return `${this.translationKey}.${relativeKey}`; // for backward compatibility
  }

  private getPartialTranslationKey(): string {
    switch (this.statusType) {
      case StatusType.SUCCESS: {
        return 'success';
      }
      case StatusType.ERROR: {
        return 'error';
      }
      default:
        return '';
    }
  }

  // Made for backward compatibility
  private async getSwitcherContextData(): Promise<void> {
    this.statusModalWindowSharedContext = await this.switcher.sharedContext$
      ?.pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();
    this.cd.detectChanges();
  }
}
