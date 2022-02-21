import { inject, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OperationsTrackerService } from 'core/modules/data/services';
import { of, throwError } from 'rxjs';
import { ActionDispatcherService } from './action-dispatcher.service';

describe('Service: ActionDispatcher', () => {
  let underTest: ActionDispatcherService;

  let mockStore: MockStore<any>;
  let operationsTracker: OperationsTrackerService;

  let fakeOperationId: string;
  let fakeAction: Action;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), { provide: OperationsTrackerService, useValue: {} }, ActionDispatcherService],
    });
  });

  beforeEach(() => {
    underTest = TestBed.inject(ActionDispatcherService);
    mockStore = TestBed.inject(Store) as MockStore<any>;
    operationsTracker = TestBed.inject(OperationsTrackerService);

    operationsTracker.getOperationData = jasmine.createSpy('getOperationData').and.returnValue(of({}));

    fakeOperationId = 'fake-operation';
    fakeAction = {
      type: 'fake-action-type',
    };
  });

  it('should ...', inject([ActionDispatcherService], (service: ActionDispatcherService) => {
    expect(service).toBeTruthy();
  }));

  it('should dispatch provided action in store', async () => {
    // Arrange
    spyOn(mockStore, 'dispatch');

    // Act
    await underTest.dispatchActionAsync(fakeAction, fakeOperationId);

    // Assert
    expect(mockStore.dispatch).toHaveBeenCalledWith(fakeAction);
  });

  it('should call "getOperationStatus" with required params', async () => {
    // Arrange
    const fakePartition = 'fake-partition';

    // Act
    await underTest.dispatchActionAsync(fakeAction, fakeOperationId, fakePartition);

    // Assert
    expect(operationsTracker.getOperationData).toHaveBeenCalledWith(fakeOperationId, fakePartition);
  });

  it('should throw an error from operation tracker when the error was tracked', async () => {
    // Arrange
    const expectedError = new Error('fake-message');
    operationsTracker.getOperationData = jasmine
      .createSpy('getOperationStatus')
      .and.callFake(() => throwError(expectedError));

    // Act
    try {
      await underTest.dispatchActionAsync(fakeAction, fakeOperationId);
      fail('expected error was not thrown');
    } catch (actualError) {
      expect(actualError).toBe(expectedError);
    }
  });

  it('should return a data that was provided to operation tracker operation', async () => {
    // Arrange
    const someOperationData = { firstProp: 'test', secondProp: 'test' };
    operationsTracker.getOperationData = jasmine.createSpy('getOperationData').and.returnValue(of(someOperationData));

    // Act
    const res = await underTest.dispatchActionAsync(fakeAction, fakeOperationId);

    // Assert
    expect(res).toBe(someOperationData);
  });
});
