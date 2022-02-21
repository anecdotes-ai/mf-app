import { TestBed } from '@angular/core/testing';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { MessageBusService } from '../message-bus/message-bus.service';
import { LoaderManagerService } from './loader-manager.service';

describe('Service: LoaderManager', () => {
  let service: LoaderManagerService;
  let messageBusService: MessageBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderManagerService, { provide: MessageBusService, useValue: {} }],
    });

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    service = TestBed.inject(LoaderManagerService);
  });

  it('should be able to create service instance', () => {
    expect(service).toBeTruthy();
  });

  describe('#show', () => {
    it('should emit loaderStream$ with true value', (done) => {
      // Act
      service.show();

      // Assert
      service.loaderStream$.subscribe((loaderShow) => {
        expect(loaderShow).toBeTrue();
        done();
      });
    });
  });

  describe('#hide', () => {
    it('should emit loaderStream$ with false value', (done) => {
      // Act
      service.hide();

      // Assert
      service.loaderStream$.subscribe((loaderShow) => {
        expect(loaderShow).toBeFalse();
        done();
      });
    });
  });
});
