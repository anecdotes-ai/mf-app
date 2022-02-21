import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalWindow, ModalWindowEntityWrapper, ModalWindowWithSwitcher } from 'core/models';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ComponentToSwitch } from 'core/modules/component-switcher/models/component-to-switch';
import { MessageBusService } from 'core/services';
import { ModalWindowMessageKeys } from 'core/modules/modals';
import { SubscriptionDetacher } from 'core/utils';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-modal-window-outlet',
  templateUrl: './modal-window-outlet.component.html',
  styleUrls: ['./modal-window-outlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWindowOutletComponent implements OnInit, OnDestroy {
  /**
   * Will assign id for host element in case window object contains value for id.
   * Usefull when we need to specify custom styles for modal window related things.
   */
  @HostBinding('attr.id')
  private get id(): string {
    return this.currentModalWindow?.window?.id;
  }

  @HostBinding('class.background')
  private get backgroundDisplay(): boolean {
    if (!this.currentModalWindow?.window) {
      return false;
    }
    // undefined is not equal to false, so undefined  for options object fields means that user didn't provide this option and undefined used as default value.
    return this.currentModalWindow.window?.options?.displayBackground !== false;
  }

  @HostBinding('class.hidden')
  private isHidden = true;

  get isCloseBtnDisplay(): boolean {
    // undefined is not equal to false, so undefined  for options object fields means that user didn't provide this option and undefined used as default value.
    return this.currentModalWindow?.window.options?.closeBtnDisplay !== false;
  }

  private get closeOnBackgroundClick(): boolean {
    // undefined is not equal to false, so undefined  for options object fields means that user didn't provide this option and undefined used as default value.
    return this.currentModalWindow?.window.options?.closeOnBackgroundClick !== false;
  }

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('switcherRef')
  private swithcerDir: ComponentSwitcherDirective;

  modalSwitcherMode: boolean;

  currentModalWindow: ModalWindowEntityWrapper;
  modalWindowsQueue: ComponentToSwitch[] = [];

  constructor(
    private messageBus: MessageBusService,
    private currentCd: ChangeDetectorRef,
    // See more here: https://github.com/angular/angular/issues/22560
    @SkipSelf() private parentCd: ChangeDetectorRef,
    private router: Router
  ) {}

  @HostListener('document:keydown.escape', ['event$']) onKeydownHandler(_: KeyboardEvent): void {
    this.closeModal();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngOnInit(): void {
    this.hide(); // by default is hidden
    this.messageBus
      .getObservable<ModalWindowEntityWrapper>(ModalWindowMessageKeys.OpenSingleModal)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(this.openModal.bind(this));

    this.messageBus
      .getObservable<ComponentToSwitch[]>(ModalWindowMessageKeys.OpenModals)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(this.openModals.bind(this));

    this.messageBus
      .getObservable<Pick<ModalWindow, 'id' | 'context'>>(ModalWindowMessageKeys.UpdateModalContext)
      .pipe(
        filter((payload) => payload.id === this.id),
        this.detacher.takeUntilDetach()
      )
      .subscribe(this.updateModalContext.bind(this));

    this.messageBus
      .getObservable<Pick<ModalWindow, 'id' | 'options'>>(ModalWindowMessageKeys.UpdateModalOptions)
      .pipe(
        filter((payload) => payload.id === this.id),
        this.detacher.takeUntilDetach()
      )
      .subscribe(this.updateModalOptions.bind(this));

    this.messageBus
      .getObservable<ModalWindow>(ModalWindowMessageKeys.OpenAlert)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(this.openAlert.bind(this));

    this.messageBus
      .getObservable<ModalWindow>(ModalWindowMessageKeys.CloseModal)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(this.closeModal.bind(this));

    this.router.events.pipe(this.detacher.takeUntilDetach()).subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.closeModal();
      }
    });
  }

  getAlertIconByAlertType(alertType: string): string {
    switch (alertType) {
      case 'success': {
        return 'status_complete';
      }
      default:
        return null;
    }
  }

  closeModal(): void {
    if (this.currentModalWindow?.window?.options?.onClose) {
      this.currentModalWindow.window.options.onClose();
    }
    this.currentModalWindow = null;
    this.modalWindowsQueue = [];
    this.hide();
    this.detectChanges();
  }

  private openModal(modal: ModalWindow): void {
    this.modalSwitcherMode = false;
    this.currentModalWindow = { window: modal, templateWindow: modal, type: 'window' };
    this.display();
    this.detectChanges();
  }

  private openModals(modal: ModalWindowWithSwitcher): void {
    this.currentModalWindow = {
      window: modal,
      switcherWindow: modal,
      type: 'switcher',
    };
    this.upsertComponents(modal.componentsToSwitch);
    this.display();
    this.detectChanges();
    this.swithcerDir.goById(modal.componentsToSwitch[0].id);
    this.detectChanges();
    this.parentCd.detectChanges();
  }

  private upsertComponents(modals: ComponentToSwitch[]): void {
    this.modalSwitcherMode = true;
    // Upsert
    modals.forEach((element) => {
      const index = this.modalWindowsQueue.findIndex((val) => val.id === element.id);

      if (index === -1) {
        this.modalWindowsQueue = [...this.modalWindowsQueue, element];
      } else {
        this.modalWindowsQueue[index] = element;
        this.modalWindowsQueue = [...this.modalWindowsQueue];
      }
    });
  }

  private updateModalContext({ context }: Pick<ModalWindow, 'id' | 'context'>): void {
    if (this.currentModalWindow) {
      this.currentModalWindow.window.context = context;
    }

    this.detectChanges();
  }

  private updateModalOptions({ options }: Pick<ModalWindow, 'id' | 'options'>): void {
    if (this.currentModalWindow) {
      this.currentModalWindow.window.options = options;
    }

    this.detectChanges();
  }

  private openAlert(modal: ModalWindow): void {
    this.currentModalWindow = { window: modal, type: 'alert' };
    this.display();
    this.detectChanges();
  }

  /**
   * Removes 'hidden' class from host element and displays modal
   */
  private display(): void {
    this.isHidden = false;
  }

  /**
   * Assigns 'hidden' class on host element and closes modal
   */
  private hide(): void {
    this.isHidden = true;
  }

  @HostListener('click', ['$event'])
  private hostClick(event: MouseEvent): void {
    if (event.currentTarget === event.composedPath()[0] && this.closeOnBackgroundClick) {
      this.closeModal();
    }
  }

  private detectChanges(): void {
    // For some reason, when we call the components change detection
    // it doesn't take into account hostbindings and some classes get lost from the host element
    // but if we use call parentCd.detectChanges it doesn't detect changes in the component and the template doesn't render as we need
    // as a workaround we end up with calling both ChangeDetectorRef's
    this.currentCd.detectChanges(); // Updates the component's template
    this.parentCd.detectChanges(); // Updates host bindings. See more here: https://github.com/angular/angular/issues/22560
  }
}
