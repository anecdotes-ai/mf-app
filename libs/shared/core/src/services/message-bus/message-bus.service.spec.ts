import { async, inject, TestBed } from '@angular/core/testing';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { MessageBusService } from './message-bus.service';

describe('Service: MessageBus', () => {
  let messageBusService: MessageBusService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [MessageBusService],
    });
  }));

  beforeEach(() => {
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);
  });

  it('should be created', inject([MessageBusService], (service: MessageBusService) => {
    // Assert
    expect(service).toBeTruthy();
  }));

  it('should send message and get result with the same key', (done) => {
    // Arrange
    const fakeDataToSendFirst = [{ fieldId: 'fakeFieldId1', value: 'fakeValue1' }];
    const fakeDataToSendSecond = [{ fieldId: 'fakeFieldId2', value: 'fakeValue2' }];
    let result: any;

    messageBusService.getObservable('someKey').subscribe((message) => {
      // Assert
      expect(message).not.toEqual(fakeDataToSendSecond);
      done();
    });

    messageBusService.getObservable('someAnotherKey').subscribe((message) => {
      // Assert
      expect(message).toEqual(fakeDataToSendSecond);
      done();
    });

    messageBusService.getObservable('someWrongKey').subscribe((message) => {
      result = message;
      done();
    });

    // Assert
    expect(result).toBeUndefined();

    // Act
    messageBusService.sendMessage('someKey', fakeDataToSendFirst);
    messageBusService.sendMessage('someAnotherKey', fakeDataToSendSecond);
  });
});
