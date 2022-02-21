import { TestBed } from '@angular/core/testing';
import { WindowHelperService } from 'core/services';
import { configureTestSuite } from 'ng-bullet';
import { HIDDEN_TIPS } from '../../constants/localstorageKeys.constants';
import { TipManagerService } from './tip-manager.service';

describe('TipLocalstorageManagerService', () => {
  configureTestSuite();

  let serviceUnderTest: TipManagerService;
  let windowHelperService: WindowHelperService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        TipManagerService,
        {
        provide: WindowHelperService,
        useValue: {
          getWindow: jasmine.createSpy('getWindow').and.returnValue({
            localStorage: { setItem: jasmine.createSpy('setItem'), getItem: jasmine.createSpy('getItem').and.returnValue('["item1", "item2"]') },
          }),
        }},
      ],
    });
    serviceUnderTest = TestBed.inject(TipManagerService);
    windowHelperService = TestBed.inject(WindowHelperService);
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('getHiddenTipsFromLocalStorage()', () => {
    it('should call getWindow', () => {
      // Act
      serviceUnderTest.getHiddenTipsFromLocalStorage();

      // Assert
      expect(windowHelperService.getWindow).toHaveBeenCalled();
    });

    it('should call getItem with HIDDEN_TIPS', () => {
      // Arrange
      const { localStorage } = windowHelperService.getWindow();

      // Act
      serviceUnderTest.getHiddenTipsFromLocalStorage();

      // Assert
      expect(localStorage.getItem).toHaveBeenCalledWith(HIDDEN_TIPS);
    });

    it('should return parsed data from localstorage', () => {
      // Arrange
      const { localStorage } = windowHelperService.getWindow();
      const parsedLocalStorageItem = JSON.parse('["item1", "item2"]');

      // Act
      const result = serviceUnderTest.getHiddenTipsFromLocalStorage();

      // Assert
      expect(result).toEqual(parsedLocalStorageItem);
    });

    it('should return empty massive when there is no parsed data', () => {
      // Arrange
      const { localStorage } = windowHelperService.getWindow();
      localStorage.getItem = jasmine.createSpy('getItem').and.returnValue('[]');

      // Act
      const result = serviceUnderTest.getHiddenTipsFromLocalStorage();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('setHiddenTipsToLocalStorage()', () => {
    it('should call getWindow', () => {
      // Act
      serviceUnderTest.setHiddenTipsToLocalStorage(['somevalue']);

      // Assert
      expect(windowHelperService.getWindow).toHaveBeenCalled();
    });

    it('should call setItem with HIDDEN_TIPS and stringified items from localstorage', () => {
      // Arrange
      const { localStorage } = windowHelperService.getWindow();
      const hiddenTips = ['someValue1', 'someValue2'];
      const stringifyedData = JSON.stringify(hiddenTips);

      // Act
      serviceUnderTest.setHiddenTipsToLocalStorage(hiddenTips);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith(HIDDEN_TIPS, stringifyedData);
    });
  });
});
