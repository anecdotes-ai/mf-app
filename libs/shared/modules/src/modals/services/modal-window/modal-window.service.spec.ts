import { ModalWindowMessageKeys } from './constants/modal-window-message-keys.constants';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalWindow } from 'core';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { Subject } from 'rxjs';
import { MessageBusService } from 'core/services';
import { ModalWindowService } from './modal-window.service';

@Component({
  template: `
    <app-modal-window-outlet></app-modal-window-outlet>
    <ng-template #fakeModalContent>
      <div class="modal-content">Something here</div>
    </ng-template>
  `,
})
class TestComponent {
  @ViewChild('fakeModalContent', { static: true }) modalTemplate: TemplateRef<any>;
}

describe('Service: ModalWindow', () => {
  let spyClose: jasmine.Spy;
  let spyOpenSuccessAlert: jasmine.Spy;
  let modalWindowService: ModalWindowService;
  let messageBusService: MessageBusService;
  let fixture: ComponentFixture<TestComponent>;
  let fakeModal: TemplateRef<any>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MessageBusService, useValue: {} }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    const testComponent = fixture.componentInstance;
    fakeModal = testComponent.modalTemplate;
    modalWindowService = TestBed.inject(ModalWindowService);

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    //  Spies
    spyClose = spyOn(modalWindowService, 'close').and.callThrough();
    spyOpenSuccessAlert = spyOn(modalWindowService, 'openSuccessAlert').and.callThrough();
  });
  it('should created', () => {
    expect(modalWindowService).toBeTruthy();
  });

  describe('Test: Open', () => {
    it(' when open modal should send message "open-modal" ', () => {
      // Arrange
      const fakeModalWindow: ModalWindow = { template: fakeModal };

      // Act
      modalWindowService.open(fakeModalWindow);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(
        ModalWindowMessageKeys.OpenSingleModal,
        fakeModalWindow
      );
    });
  });

  describe('Test: Close', () => {
    it(' when close modal should send message "close-modal"', () => {
      // Act
      modalWindowService.close();

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(ModalWindowMessageKeys.CloseModal, null);
    });
  });

  describe('Test: OpenSuccessAlert', () => {
    it(' when open success alert should close window and send message "open-alert"', () => {
      // Arrange
      const messageTranslationKey = 'some string';
      const modalWindow: ModalWindow = { template: null, context: { messageTranslationKey, type: 'success' } };

      // Act
      modalWindowService.openSuccessAlert(messageTranslationKey);

      // Assert
      expect(spyClose).toHaveBeenCalled();
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(ModalWindowMessageKeys.OpenAlert, modalWindow);
    });
  });
});
