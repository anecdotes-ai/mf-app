import { ControlContextService } from '../../services';
import { SharedContextAccessorDirective } from './shared-context-accessor.directive';

describe('Directive: SharedContextAccessor', () => {
  let underTest: SharedContextAccessorDirective;
  let contextServiceMock: ControlContextService;

  beforeEach(() => {
    contextServiceMock = {} as any;
    underTest = new SharedContextAccessorDirective(contextServiceMock);
  });

  it('should create an instance', () => {
    expect(underTest).toBeTruthy();
  });

  describe('context property', () => {
    it('should return ControlContextService', () => {
      // Arrange
      // Act
      const actualContext = underTest.context;

      // Assert
      expect(actualContext).toBe(contextServiceMock);
    });
  });
});
