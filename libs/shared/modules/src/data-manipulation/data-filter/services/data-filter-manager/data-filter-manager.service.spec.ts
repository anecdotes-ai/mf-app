import { TestBed, inject } from '@angular/core/testing';
import { DataFilterManagerService } from './data-filter-manager.service';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { NEVER, Observable, of } from 'rxjs';
import { FilterDefinition, FilterOptionState } from '../../models';
import { FilterMessageBusMessages } from '../../constants';

describe('Service: DataFilterManager', () => {
  let messageBus: MessageBusService;
  let sendMessageSpy: jasmine.Spy;
  let sendAsyncMessageSpy: jasmine.Spy;
  let getMessageSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataFilterManagerService, MessageBusService],
    });
    messageBus = TestBed.inject(MessageBusService);
    sendMessageSpy = spyOn(messageBus, 'sendMessage');
    sendAsyncMessageSpy = spyOn(messageBus, 'sendAsyncMessage');
    getMessageSpy = spyOn(messageBus, 'getObservable');
  });

  describe('open-close functions', () => {
    it('should send filter-open event in message-bus', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data = { fieldId: 'SomeFieldId', value: 'someValue' };

        // Act
        service.open(data);

        // Assert
        expect(sendAsyncMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_OPEN, [data]);
      }
    ));
  });

  describe('close function', () => {
    it('should send filter-close event in message-bus', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const destroyComponent = true;

        // Act
        service.close(destroyComponent);

        // Assert
        expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_CLOSE, destroyComponent);
      }
    ));
  });

  describe('#getFilteringEvent ', () => {
    it('should return any boolean values', inject([DataFilterManagerService], (service: DataFilterManagerService) => {
      // Arrange
      getMessageSpy.and.callFake((key: string) => {
        if (key === FilterMessageBusMessages.FILTER_FILTERING) {
          return of(true);
        } else {
          return NEVER;
        }
      });

      // Act
      service.getFilteringEvent().subscribe((res) => {
        // Assert
        expect(res).toBeInstanceOf(Boolean);
      });
    }));
  });

  describe('#getDataFilterEvent', () => {
    it('should return filter-data-filtered message value', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data = [{ main_property: 'Main property', secondary_property: 'Secondary property' }];
        getMessageSpy.and.callFake((key: string) => {
          if (key === FilterMessageBusMessages.FILTER_DATA_FILTERED) {
            return of(data);
          } else {
            return NEVER;
          }
        });

        // Act
        service.getDataFilterEvent().subscribe((res) => {
          // Assert
          expect(res).toBe(data);
        });
      }
    ));
  });

  describe('#getFilteringOptions', () => {
    it('should return filter-filtering-options message value', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data: {
          [key: string]: { [key: string]: FilterOptionState<any> };
        } = {
          keyString: {
            innerKeyString: {
              checked: true,
              displayed: true,
              exactValue: true,
              value: 'anyValue',
              calculatedCount: 20,
            },
          },
        };

        getMessageSpy.and.callFake((key: string) => {
          if (key === FilterMessageBusMessages.FILTER_FILTERING_OPTIONS) {
            return of(data);
          } else {
            return NEVER;
          }
        });

        // Act
        service.getFilteringOptions().subscribe((res) => {
          // Assert
          expect(res).toBe(data);
        });
      }
    ));
  });

  describe('#toggleOptions', () => {
    it('should send filter-toggle-options message with filter options', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data: { fieldId: string; value: any } = { fieldId: 'SomeFieldId', value: 'someValue' };

        // Act
        service.toggleOptions(data);

        // Assert
        expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_TOGGLE_OPTIONS, [data]);
      }
    ));
  });

  describe('#setData', () => {
    it('should send filter-set-data message with appropriate data', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data: Array<any> = [{ data: 'Some data' }];

        // Act
        service.setData(data);

        // Assert
        expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_SET_DATA, data);
      }
    ));
  });

  describe('#setFilterDefinition', () => {
    it('should send filter-set-definition message with appropriate data', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data: FilterDefinition<any>[] = [{ fieldId: 'FakeId' }];

        // Act
        service.setFilterDefinition(data);

        // Assert
        expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_SET_DEFINITION, data);
      }
    ));
  });

  describe('#reset', () => {
    it('should send filter-reset message with null value', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data = null;

        // Act
        service.reset();

        // Assert
        expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_RESET, data);
      }
    ));
  });

  describe('get toggle event functions', () => {
    it('#getToggledEvent should return true', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        getMessageSpy.and.callFake((key: string) => {
          if (key === FilterMessageBusMessages.FILTER_OPENED) {
            return of(true);
          } else {
            return NEVER;
          }
        });

        // Act
        service.getToggledEvent().subscribe((res) => {
          // Assert
          expect(res).toBeTrue();
        });
      }
    ));

    it('#getToggledEvent should return false', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        getMessageSpy.and.callFake((key: string) => {
          if (key === FilterMessageBusMessages.FILTER_CLOSED) {
            return of(false);
          } else {
            return NEVER;
          }
        });

        // Act
        service.getToggledEvent().subscribe((res) => {
          // Assert
          expect(res).toBeFalse();
        });
      }
    ));
  });

  describe('#getFilterDefinition', () => {
    it('should return filter-set-definition message value', inject(
      [DataFilterManagerService],
      (service: DataFilterManagerService) => {
        // Arrange
        const data: Observable<FilterDefinition<any>[]> = of([{ fieldId: 'some-field' }]);
        getMessageSpy.and.returnValue(data);

        // Act
        const result = service.getFilterDefinition();

        // Assert
        expect(getMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_SET_DEFINITION);
        expect(result).toBe(data);
      }
    ));
  });
});
