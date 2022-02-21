import { async, TestBed } from '@angular/core/testing';
import { MobileAndNotSupportBrowserService } from './mobile-and-not-support-browser.service';
import { AppConfigService, WindowHelperService } from 'core';

describe('MobileAndNotSupportBrowserService', () => {
  let service: MobileAndNotSupportBrowserService;
  let appConfigService: AppConfigService;
  let windowMock: Window;
  let windowHelperService: WindowHelperService;
  let userAgent: string;
  let detectSupportedBrowserSpy: jasmine.Spy;
  let mockIsMobile: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WindowHelperService, useValue: {} },
        { provide: AppConfigService, useValue: { config: {} } },
      ],
    });
  }));

  beforeEach(() => {
    service = TestBed.inject(MobileAndNotSupportBrowserService);
    appConfigService = TestBed.inject(AppConfigService);
    windowHelperService = TestBed.inject(WindowHelperService);

    // Arrange
    mockIsMobile = {
      Android: 'Android',
      BlackBerry: 'BlackBerry',
      iOS: 'iPhone' || 'iPad' || 'iPod',
      Opera: 'Opera Mini',
      Windows: 'IEMobile',
    };
    windowMock = {
      location: {} as Location,
      navigator: {} as Navigator,
    } as Window;
    windowHelperService.getWindow = jasmine.createSpy('getWindow').and.returnValue(windowMock);
    userAgent = 'chrome';
    windowMock.navigator['__defineGetter__']('userAgent', () => {
      return userAgent;
    });

    // Spy
    detectSupportedBrowserSpy = spyOn(service, 'detectSupportedBrowser');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test: detectSupportedBrowser', () => {
    it('should check browser if it NOT mobile device', () => {
      // Arrange
      userAgent = 'someBrowser';

      // Act
      service.initialize();

      // Assert
      expect(detectSupportedBrowserSpy).toHaveBeenCalled();
      expect(service.isBrowserSupported).toBeUndefined();
    });

    it('should NOT redirect to URL from config if browser supported', async () => {
      // Arrange
      const redirectUrl = 'browserNotSupportedUrl';
      appConfigService.config.redirectUrls = {
        browserNotSupported: redirectUrl,
      };
      userAgent = 'chrome';

      // Act
      service.detectSupportedBrowser();

      // Assert
      expect(windowMock.location.href).not.toBe(redirectUrl);
    });

    it('should NOT redirect to URL from config if browser supported', async () => {
      // Arrange
      const redirectUrl = 'browserNotSupportedUrl';
      appConfigService.config.redirectUrls = {
        browserNotSupported: redirectUrl,
      };
      userAgent = 'edg';

      // Act
      service.detectSupportedBrowser();

      // Assert
      expect(windowMock.location.href).not.toBe(redirectUrl);
    });
  });

  describe('Test: checkMobileDevice', () => {
    it('should NOT check browser userAgent if it Android', () => {
      // Arrange
      userAgent = mockIsMobile.Android;

      // Act
      service.initialize();

      // Assert
      expect(detectSupportedBrowserSpy).not.toHaveBeenCalled();
    });
    it('should NOT check browser userAgent if it BlackBerry', () => {
      // Arrange
      userAgent = mockIsMobile.BlackBerry;

      // Act
      service.initialize();

      // Assert
      expect(detectSupportedBrowserSpy).not.toHaveBeenCalled();
    });
    it('should NOT check browser userAgent if it iOS', () => {
      // Arrange
      userAgent = mockIsMobile.iOS;

      // Act
      service.initialize();

      // Assert
      expect(detectSupportedBrowserSpy).not.toHaveBeenCalled();
    });
    it('should NOT check browser userAgent if it Opera mini', () => {
      // Arrange
      userAgent = mockIsMobile.Opera;

      // Act
      service.initialize();

      // Assert
      expect(detectSupportedBrowserSpy).not.toHaveBeenCalled();
    });
    it('should NOT check browser userAgent if it IEMobile', () => {
      // Arrange
      userAgent = mockIsMobile.Windows;

      // Act
      service.initialize();

      // Assert
      expect(detectSupportedBrowserSpy).not.toHaveBeenCalled();
    });
  });
});
