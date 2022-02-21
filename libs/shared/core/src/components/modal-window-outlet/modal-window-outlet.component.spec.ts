import { ModalWindowMessageKeys } from 'core/modules/modals';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ModalWindow } from 'core';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { BehaviorSubject } from 'rxjs';
import { MessageBusService } from '../../services';
import { ModalWindowOutletComponent } from './modal-window-outlet.component';

@Component({
  template: `
    <app-modal-window-outlet></app-modal-window-outlet>
    <ng-template #fakeModalContent>
      <div class="modal-content">Something here</div>
    </ng-template>
  `,
})
class WrapperComponent {
  @ViewChild(ModalWindowOutletComponent, { static: true }) appComponentRef: ModalWindowOutletComponent;
  @ViewChild('fakeModalContent', { static: true }) modalTemplate: TemplateRef<any>;
}

describe('ModalWindowOutletComponent', () => {
  let component: ModalWindowOutletComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let fakeModal: TemplateRef<any>;

  const routerEvents$ = new BehaviorSubject<RouterEvent>(null);
  const routerStub = {
    events: routerEvents$,
  };

  let messageBusService: MessageBusService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: MessageBusService, useValue: {} },
      ],
      declarations: [WrapperComponent, ModalWindowOutletComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    const wrapperComponent = fixture.componentInstance;
    component = wrapperComponent.appComponentRef;
    fakeModal = wrapperComponent.modalTemplate;

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should hide modal by default', async () => {
      // Arrange
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );
      modalWindowOutletHost.classList.remove('hidden');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(modalWindowOutletHost.classList.contains('hidden')).toBeTruthy();
    });

    it('subscribe for open-modal event should execute when exact message sent', async () => {
      // Arrange
      const fakeModalWindow: ModalWindow = { template: fakeModal };
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      messageBusService.sendMessage(ModalWindowMessageKeys.OpenSingleModal, fakeModalWindow);
      const modalContent = fixture.debugElement.query(By.css('.modal-content'));

      // Assert
      expect(component.currentModalWindow).toEqual({
        window: fakeModalWindow,
        type: 'window',
        templateWindow: fakeModalWindow,
      });
      expect(modalWindowOutletHost.classList.contains('hidden')).toBeFalsy();
      expect(modalContent).toBeTruthy();
    });

    it('subscribe for open-alert event should execute when exact message sent', async () => {
      // Arrange
      const fakeAlertWindow: ModalWindow = { template: null };
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      messageBusService.sendMessage(ModalWindowMessageKeys.OpenAlert, fakeAlertWindow);

      // Assert
      expect(component.currentModalWindow).toEqual({ window: fakeAlertWindow, type: 'alert' });
      expect(modalWindowOutletHost.classList.contains('hidden')).toBeFalsy();
    });

    it('subscribe for close-modal event should execute when exact message sent', async () => {
      // Arrange
      const fakeModalWindow: ModalWindow = { template: fakeModal };
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );
      component.currentModalWindow = { window: fakeModalWindow, type: 'window', templateWindow: fakeModalWindow };
      modalWindowOutletHost.classList.remove('hidden');
      const modalContent = fixture.debugElement.query(By.css('.modal-content'));

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      messageBusService.sendMessage(ModalWindowMessageKeys.CloseModal, null);

      // Assert
      expect(component.currentModalWindow).toBeNull();
      expect(modalWindowOutletHost.classList.contains('hidden')).toBeTruthy();
      expect(modalContent).toBeFalsy();
    });

    it('should close modal on navigation end', async () => {
      // Arrange
      const navigationEndEvent = new NavigationEnd(1, 'some-url', 'some-url');
      spyOn(component, 'closeModal');

      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      routerEvents$.next(navigationEndEvent);
      const modalContent = fixture.debugElement.query(By.css('.modal-content'));

      // Assert
      expect(component.closeModal).toHaveBeenCalled();
      expect(modalContent).toBeFalsy();
    });
  });

  describe('#getAlertIconByAlertType', () => {
    it('should correctly get success alert icon', () => {
      // Arrange
      const value = 'status_complete';

      // Act
      const icon = component.getAlertIconByAlertType('success');

      // Assert
      expect(icon).toEqual(value);
    });

    it('should return null if provided alertType is unknown', () => {
      // Arrange
      const value = null;

      // Act
      const icon = component.getAlertIconByAlertType('some_value');

      // Assert
      expect(icon).toEqual(value);
    });
  });

  describe('#hostClick', () => {
    it('should close modal on outside click if currentModalWindow.window.options.closeOnBackgroundClick is not false', () => {
      // Arrange
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );
      const fakeModalWindow: ModalWindow = { template: fakeModal };
      component.currentModalWindow = { window: fakeModalWindow, type: 'window', templateWindow: fakeModalWindow };
      modalWindowOutletHost.classList.remove('hidden');

      // Act
      modalWindowOutletHost.dispatchEvent(new Event('click'));

      // Assert
      expect(component.currentModalWindow).toBeNull();
      expect(modalWindowOutletHost.classList.contains('hidden')).toBeTruthy();
    });

    it('should NOT close modal on outside click if currentModalWindow.window.options.closeOnBackgroundClick is false', () => {
      // Arrange
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );
      const fakeModalWindow: ModalWindow = { template: fakeModal, options: { closeOnBackgroundClick: false } };
      component.currentModalWindow = { window: fakeModalWindow, type: 'window', templateWindow: fakeModalWindow };

      // Act
      modalWindowOutletHost.dispatchEvent(new Event('click'));

      // Assert
      expect(component.currentModalWindow).toBeTruthy();
      expect(modalWindowOutletHost.classList.contains('hidden')).toBeFalsy();
    });
  });

  describe('#option settings', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const fakeModalWindow: ModalWindow = { template: fakeModal };
      component.currentModalWindow = { window: fakeModalWindow, type: 'window', templateWindow: fakeModalWindow };
    });

    it('if options are undefined, should set .background css class to host and isCloseBtnDisplay shoudl return true', async () => {
      // Arrange
      component.currentModalWindow.window.options = undefined;

      // Act
      fixture.detectChanges();

      // Assert
      expectForBackgroundCssClass().toBeTruthy();
      expect(component.isCloseBtnDisplay).toBeTrue();
    });

    it('should set background for modal if displayBackground is undefined for options by default', async () => {
      // Arrange
      component.currentModalWindow.window.options = { displayBackground: undefined };

      // Act
      fixture.detectChanges();

      // Assert
      expectForBackgroundCssClass().toBeTruthy();
    });

    it('should set background for modal if displayBackground is true', async () => {
      // Arrange
      component.currentModalWindow.window.options = { displayBackground: true };

      // Act
      fixture.detectChanges();

      // Assert
      expectForBackgroundCssClass().toBeTruthy();
    });

    it('should not set background for modal if displayBackground is false', async () => {
      // Arrange
      component.currentModalWindow.window.options = { displayBackground: false };

      // Act
      fixture.detectChanges();

      // Assert
      expectForBackgroundCssClass().toBeFalsy();
    });

    function expectForBackgroundCssClass(): jasmine.FunctionMatchers<any> {
      const { nativeElement: modalWindowOutletHost } = fixture.debugElement.query(
        By.directive(ModalWindowOutletComponent)
      );
      return expect(modalWindowOutletHost.classList.contains('background'));
    }

    it('isCloseBtnDisplay should return true if provided closeBtnDisplay option value is undefined', async () => {
      // Arrange
      component.currentModalWindow.window.options = { closeBtnDisplay: undefined };

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.isCloseBtnDisplay).toBeTrue();
    });

    it('isCloseBtnDisplay should return true if provided closeBtnDisplay option value is undefined', async () => {
      // Arrange
      component.currentModalWindow.window.options = { closeBtnDisplay: true };

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.isCloseBtnDisplay).toBeTrue();
    });

    it('isCloseBtnDisplay should return false if provided closeBtnDisplay option value is false', async () => {
      // Arrange
      component.currentModalWindow.window.options = { closeBtnDisplay: false };

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.isCloseBtnDisplay).toBeFalse();
    });
  });

  describe('#option onClose', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const fakeModalWindow: ModalWindow = { template: fakeModal };
      component.currentModalWindow = { window: fakeModalWindow, type: 'window', templateWindow: fakeModalWindow };
    });

    it('if onClose is defined in options, should call it', async () => {
      // Arrange
      const fakeOnClose = jasmine.createSpy('onClose');
      component.currentModalWindow.window.options = { onClose: fakeOnClose};

      // Act
      component.closeModal();

      // Assert
      expect(fakeOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('#escapeKeyPress', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const fakeModalWindow: ModalWindow = { template: fakeModal };
      component.currentModalWindow = { window: fakeModalWindow, type: 'window', templateWindow: fakeModalWindow };
    });

    it('should closeModal if user pressed escape key', async () => {
      // Arrange
      spyOn(component, 'closeModal');
      const event = new KeyboardEvent('keydown', { key: 'escape'});

      // Act
      document.dispatchEvent(event);
      fixture.detectChanges();

      // Assert
      expect(component.closeModal).toHaveBeenCalled();
    });
  });
});
