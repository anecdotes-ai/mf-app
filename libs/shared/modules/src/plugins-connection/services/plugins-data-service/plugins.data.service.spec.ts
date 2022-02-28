import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PluginsDataService } from './plugins.data.service';
import { placeholderFile } from 'core/modules/plugins-connection/utils/placeholder-file';
import { Operation } from 'fast-json-patch';
import { MultiAccountsEventService } from 'core/modules/data/services/event-tracking/multi-accounts-event-service/multi-accounts-event.service';

describe('PluginsDataService', () => {
  let service: PluginsDataService;
  let router: Router;

  const previousValues = {
    someField: 'some-field',
  };

  const currentValues = {
    someField: 'some-field',
    file1: new File([], 'file1', { type: placeholderFile }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: MultiAccountsEventService, useValue: {} }
      ],
    });

    service = TestBed.inject(PluginsDataService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should not include file with ${placeholderFile} type to operations array`, () => {
    // Arrange
    const result: Operation[] = [];

    // Act
    const operations = service.resolveReconnectOperations(previousValues, currentValues);

    // Assert
    expect(operations).toEqual(result);
  });

  it(`should not remove file from operations array if its type !== ${placeholderFile}`, () => {
    // Arrange
    const newCurrentValues = {
      someField: 'some-field',
      file1: new File([], 'file1', { type: 'some_type' }),
    };

    const result: Operation[] = [
      {
        op: 'add',
        path: '/file1',
        value: newCurrentValues.file1
      }
    ];

    // Act
    const operations = service.resolveReconnectOperations(previousValues, newCurrentValues);

    // Assert
    expect(operations).toEqual(result);
  });
});
