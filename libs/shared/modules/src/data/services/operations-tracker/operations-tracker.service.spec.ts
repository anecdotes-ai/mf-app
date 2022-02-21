import { TestBed } from '@angular/core/testing';
import { OperationError } from './operation-error';
import { MessageBusService } from 'core';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { OperationsTrackerService } from './operations-tracker.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

describe('Service: OperationsTracker', () => {
  let service: OperationsTrackerService;
  let messageBusService: MessageBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationsTrackerService, MessageBusService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(OperationsTrackerService);
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('#trackError', () => {
    it('should send message to messageHub with proper key and error data if partition provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const error = new Error('some-error');
      const partition = 'some-partition';

      // Act
      service.trackError(operationId, error, partition);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(`${partition}-${operationId}`, error);
    });

    it('should send message to messageHub with proper key and error data if partition not provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const error = new Error('some-error');

      // Act
      service.trackError(operationId, error);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(operationId, error);
    });
  });

  describe('#trackSuccess', () => {
    it('should send message to messageHub with proper key and null as data if partition provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const partition = 'some-partition';

      // Act
      service.trackSuccess(operationId, partition);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(`${partition}-${operationId}`, null);
    });

    it('should send message to messageHub with proper key and null as data if partition not provided', () => {
      // Arrange
      const operationId = 'some-operation';

      // Act
      service.trackSuccess(operationId);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(operationId, null);
    });
  });

  describe('#trackSuccessWithData', () => {
    it('should send message to messageHub with proper key and data if partition provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const partition = 'some-partition';
      const data = { key: 'value' };

      // Act
      service.trackSuccessWithData(operationId, data, partition);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(`${partition}-${operationId}`, data);
    });

    it('should send message to messageHub with proper key and data if partition not provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const data = { key: 'value' };

      // Act
      service.trackSuccessWithData(operationId, data);

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(operationId, data);
    });
  });

  describe('#getOperationStatus', () => {
    it('should call getObservable of message hub with proper key if partition provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const partition = 'some-partition';
      const error = new Error('some-error');

      // Act
      messageBusService.sendMessage(`${partition}-${operationId}`, error);
      service.getOperationStatus(operationId, partition);

      // Assert
      expect(messageBusService.getObservable).toHaveBeenCalledWith(`${partition}-${operationId}`);
    });

    it('should call getObservable of message hub with proper key if partition not provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const error = new Error('some-error');

      // Act
      messageBusService.sendMessage(operationId, error);
      service.getOperationStatus(operationId);

      // Assert
      expect(messageBusService.getObservable).toHaveBeenCalledWith(operationId);
    });
  });

  describe('#getOperationData', () => {
    it('should call getObservable of message hub with proper key if partition provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const partition = 'some-partition';
      const data = { key: 'value' };

      // Act
      messageBusService.sendMessage(`${partition}-${operationId}`, data);
      service.getOperationData(operationId, partition);

      // Assert
      expect(messageBusService.getObservable).toHaveBeenCalledWith(`${partition}-${operationId}`);
    });

    it('should call getObservable of message hub with proper key if partition not provided', () => {
      // Arrange
      const operationId = 'some-operation';
      const data = { key: 'value' };

      // Act
      messageBusService.sendMessage(operationId, data);
      service.getOperationData(operationId);

      // Assert
      expect(messageBusService.getObservable).toHaveBeenCalledWith(operationId);
    });

    describe('http error is tracked', () => {
      const operationId = 'some-operation';
      const somePartition = 'some-partition';

      it('should throw OperationError with needed params', (done) => {
        // Arrange
        const httpError = new HttpErrorResponse({
          status: 2303,
          error: {}
        });
        messageBusService.getObservable = jasmine.createSpy('getObservable').and.returnValue(new BehaviorSubject(httpError));

        // Act
        // Assert
        service.getOperationData(operationId, somePartition).subscribe(() => {
          fail('Expected error to be thrown');
          done();
        }, (err: OperationError) => {
          expect(err).toBeInstanceOf(OperationError);
          expect(err.operationId).toBe(operationId);
          expect(err.errorCode).toBe(httpError.status);
          expect(err.data).toBe(httpError.error);
          done();
        });
      });
    });

    describe('any error is tracked', () => {
      const operationId = 'some-operation';
      const somePartition = 'some-partition';

      it('should throw OperationError with status equal to 500', (done) => {
        // Arrange
        const error = new Error();
        messageBusService.getObservable = jasmine.createSpy('getObservable').and.returnValue(new BehaviorSubject(error));

        // Act
        // Assert
        service.getOperationData(operationId, somePartition).subscribe(() => {
          fail('Expected error to be thrown');
          done();
        }, (err: OperationError) => {
          expect(err).toBeInstanceOf(OperationError);
          expect(err.operationId).toBe(operationId);
          expect(err.data).toBeNull();
          expect(err.errorCode).toBe(500);
          done();
        });
      });
    });
  });
});
