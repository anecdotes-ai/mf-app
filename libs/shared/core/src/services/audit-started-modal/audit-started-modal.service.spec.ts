import { ModalWindowService } from 'core/modules/modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';
import { AuditStartedModalService } from './audit-started-modal.service';
import { RouterTestingModule } from '@angular/router/testing';
import { WindowHelperService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { AUDIT_STARTED_MODAL } from 'core/modules/shared-framework/constants/localstorageKeys.constants';

describe('AuditStartedModalService', () => {
  configureTestSuite();
  let modalWindowService: ModalWindowService;
  let service: AuditStartedModalService;
  let windowHelperService: WindowHelperService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        {
          provide: WindowHelperService,
          useValue: {
            getWindow: jasmine.createSpy('getWindow').and.returnValue({
              localStorage: { setItem: jasmine.createSpy('setItem'), getItem: jasmine.createSpy('getItem').and.returnValue('true') },
            }),
          },
        }],
    });
    service = TestBed.inject(AuditStartedModalService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.open = jasmine.createSpy('open');
    windowHelperService = TestBed.inject(WindowHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('shouldModalBeOpen', () => {
    it('should get correct item with given framework name', async () => {
      // Arrange
      const frameworkName = "soc2";
      
      // Act
      const value = service.shouldModalBeOpen(frameworkName);

      // Assert
      expect(windowHelperService.getWindow().localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(value).toEqual(false);
    });
  });

  describe('setModalForOpening', () => {
    it('should set correct item to false with given framework name', async () => {
      // Arrange
      const frameworkName = "soc2";

      // Act
      service.setModalForOpening(frameworkName);

      // Assert
      expect(windowHelperService.getWindow().localStorage.setItem).toHaveBeenCalledWith(`${AUDIT_STARTED_MODAL}${frameworkName}`, "false");
    });
  });

  describe('setModalDisplayed', () => {
    it('should set correct item to true with given framework name', async () => {
      // Arrange
      const frameworkName = "soc2";

      // Act
      service.setModalDisplayed(frameworkName);

      // Assert
      expect(windowHelperService.getWindow().localStorage.setItem).toHaveBeenCalledWith(`${AUDIT_STARTED_MODAL}${frameworkName}`, "true");
    });
  });
});
