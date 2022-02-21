import { TestBed } from '@angular/core/testing';
import { ControlCalculationService } from 'core/modules/data/services';
import { ControlContexInjectionToken, ControlContextConfig, ControlContextService } from './control-context.service';

describe('Service: ControlContext', () => {
  describe('when config is not provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ControlContextService, ControlCalculationService],
      });
    });

    describe('isAudit property', () => {
      it('should return false', () => {
        // Arrange
        // Act
        const actual = TestBed.inject(ControlContextService).isAudit;

        // Assert
        expect(actual).toBeFalsy();
      });
    });
  });

  describe('when config is provided', () => {
    const config: ControlContextConfig = {} as any;
    let service: ControlContextService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ControlContextService, { provide: ControlContexInjectionToken, useValue: config }],
      });
    });

    beforeEach(() => {
      service = TestBed.inject(ControlContextService);
    });

    describe('isAudit property', () => {
      it('should return false if config has false in isAudit property', () => {
        // Arrange
        config.isAudit = false;

        // Act
        const actual = service.isAudit;

        // Assert
        expect(actual).toBeFalsy();
      });

      it('should return true if config has true in isAudit property', () => {
        // Arrange
        config.isAudit = true;

        // Act
        const actual = service.isAudit;

        // Assert
        expect(actual).toBeTruthy();
      });
    });
  });
});
