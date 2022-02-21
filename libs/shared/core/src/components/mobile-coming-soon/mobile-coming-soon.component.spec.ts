import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileComingSoonComponent } from './mobile-coming-soon.component';
import { TranslateModule } from '@ngx-translate/core';
import { MobileAndNotSupportBrowserService } from 'core/services/mobile-and-not-support-browser/mobile-and-not-support-browser.service';

describe('MobileComingSoonComponent', () => {
  let component: MobileComingSoonComponent;
  let fixture: ComponentFixture<MobileComingSoonComponent>;
  let mockMobileAndNotSupportBrowserService: MobileAndNotSupportBrowserService;
  let mockResultAllTypes = false;

  beforeEach(async(() => {
    // Arrange
    mockMobileAndNotSupportBrowserService = jasmine.createSpyObj(['isMobile']);
    mockMobileAndNotSupportBrowserService.isMobile = {
      Android: () => true,
      BlackBerry: () => true,
      iOS: () => true,
      Opera: () => true,
      Windows: () => true,
      allTypes: () => {
        return mockResultAllTypes;
      },
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MobileComingSoonComponent],
      providers: [{ provide: MobileAndNotSupportBrowserService, useValue: mockMobileAndNotSupportBrowserService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test: buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`mobile.comingSoon.${relativeKey}`);
    });
  });

  describe('Test: isMobileDisplay', () => {
    it('should return true in mobile', () => {
      // Arrange
      mockResultAllTypes = true;

      // Act
      component.ngOnInit();

      // Assert
      expect(component.isMobileDisplay).toBeTrue();
    });

    it('should return false in mobile', () => {
      // Arrange
      mockResultAllTypes = false;

      // Act
      component.ngOnInit();

      // Assert
      expect(component.isMobileDisplay).toBeFalse();
    });
  });
});
