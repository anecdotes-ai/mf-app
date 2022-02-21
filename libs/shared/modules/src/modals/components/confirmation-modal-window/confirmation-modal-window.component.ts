import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  ConfirmationModalWindowInputKeys,
  ConfirmationModalWindowSharedContext,
  ConfirmationModalWindowSharedContextInputKeys,
} from '../../../modals/components/confirmation-modal-window/constants';
import { ComponentSwitcherDirective } from '../../../component-switcher';
import { filter, take } from 'rxjs/operators';
import { ModalWindowService } from '../../services/modal-window/modal-window.service';

@Component({
  selector: 'app-confirmation-modal-window',
  templateUrl: './confirmation-modal-window.component.html',
  styleUrls: ['./confirmation-modal-window.component.scss'],
})
@Input()
export class ConfirmationModalWindowComponent implements OnInit {
  private contextData: ConfirmationModalWindowSharedContext;

  @Input(ConfirmationModalWindowInputKeys.confirmTranslationKey)
  confirmTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.dismissTranslationKey)
  dismissTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.questionTranslationKey)
  questionTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.questionTranslationParams)
  questionTranslationParams: any;

  @Input(ConfirmationModalWindowInputKeys.aftermathTranslationKey)
  aftermathTranslationKey: string;

  @Input(ConfirmationModalWindowInputKeys.aftermathTranslationParams)
  aftermathTranslationParams: string;

  @Input(ConfirmationModalWindowInputKeys.aftermathTemplate)
  aftermathTemplate: TemplateRef<any>;

  @Input(ConfirmationModalWindowInputKeys.icon)
  icon: string;

  @Input(ConfirmationModalWindowInputKeys.confirmationHandlerFunction)
  confirmationHandlerFunction: () => Promise<void>;

  @Input(ConfirmationModalWindowInputKeys.dismissHandlerFunction)
  dismissHandlerFunction: () => Promise<void>;

  @Input(ConfirmationModalWindowInputKeys.closeModalAfterDismissing)
  closeModalAfterDismissing = false;

  @Input(ConfirmationModalWindowInputKeys.successWindowSwitcherId)
  successWindowSwitcherId: string;

  @Input(ConfirmationModalWindowInputKeys.errorWindowSwitcherId)
  errorWindowSwitcherId: string;

  @Input(ConfirmationModalWindowInputKeys.localStorageKey)
  localStorageKey: string;

  @Input(ConfirmationModalWindowInputKeys.dontShowTranslationKey)
  dontShowTranslationKey: string;
  @Input(ConfirmationModalWindowInputKeys.primaryButtonFirst)
  primaryButtonFirst = true;

  @Output()
  confirmClick = new EventEmitter(true);

  @Output()
  dismissClick = new EventEmitter(true);

  isLoading: boolean;
  localStorageValue: boolean | string = '';

  constructor(
    private modalWindowService: ModalWindowService,
    @Optional() private switcher: ComponentSwitcherDirective,
  ) { }

  ngOnInit(): void {
    if (this.switcher?.sharedContext$) {
      this.getSwitcherContextData();
    }
  }

  async confirm(): Promise<void> {
    if (this.contextData) {
      this.isLoading = true;
      try {
        if (this.localStorageKey) {
          localStorage.setItem(this.localStorageKey, String(this.localStorageValue));
        }
        await this.confirmationHandlerFunction();
        this.isLoading = false;
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
    } else {
      this.modalWindowService.close();
    }
    this.confirmClick.emit();
  }

  async dismiss(): Promise<void> {
    if (this.switcher) {
      if (this.dismissHandlerFunction) {
        await this.dismissHandlerFunction();
        if (this.closeModalAfterDismissing) {
          this.modalWindowService.close();
        }
        return;
      } else if (this.switcher.previousIndex) {
        if (this.closeModalAfterDismissing) {
          this.modalWindowService.close();
        }
        this.switcher.goBack();
        return;
      }
    }
    this.dismissClick.emit();
    this.modalWindowService.close();
  }

  private async getSwitcherContextData(): Promise<void> {
    this.contextData = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1)
      )
      .toPromise();

    this.confirmTranslationKey = this.confirmTranslationKey
      ? this.confirmTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.confirmTranslationKey];
    this.dismissTranslationKey = this.dismissTranslationKey
      ? this.dismissTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.dismissTranslationKey];
    this.questionTranslationKey = this.questionTranslationKey
      ? this.questionTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.questionTranslationKey];
    this.questionTranslationParams = this.questionTranslationParams
      ? this.questionTranslationParams
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.questionTranslationParams];
    this.aftermathTranslationKey = this.aftermathTranslationKey
      ? this.aftermathTranslationKey
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.aftermathTranslationKey];
    this.aftermathTranslationParams = this.aftermathTranslationParams
      ? this.aftermathTranslationParams
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.aftermathTranslationParams];
    this.aftermathTemplate = this.aftermathTemplate
      ? this.aftermathTemplate
      : (this.contextData[ConfirmationModalWindowSharedContextInputKeys.aftermathTemplate] as any);
    this.icon = this.icon ? this.icon : this.contextData[ConfirmationModalWindowSharedContextInputKeys.icon];
    this.confirmationHandlerFunction = this.confirmationHandlerFunction
      ? this.confirmationHandlerFunction
      : (this.contextData[ConfirmationModalWindowSharedContextInputKeys.confirmationHandlerFunction] as any);
    this.dismissHandlerFunction = this.dismissHandlerFunction
      ? this.dismissHandlerFunction
      : (this.contextData[ConfirmationModalWindowSharedContextInputKeys.dismissHandlerFunction] as any);
    this.successWindowSwitcherId = this.successWindowSwitcherId
      ? this.successWindowSwitcherId
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.successWindowSwitcherId];
    this.errorWindowSwitcherId = this.errorWindowSwitcherId
      ? this.errorWindowSwitcherId
      : this.contextData[ConfirmationModalWindowSharedContextInputKeys.errorWindowSwitcherId];
  }

  changeValue(value: boolean): void {
    this.localStorageValue = value;
  }
}
