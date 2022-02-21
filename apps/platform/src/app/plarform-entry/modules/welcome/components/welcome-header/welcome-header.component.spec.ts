import { AuthService } from 'core/modules/auth-core/services/auth/auth.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { WelcomeHeaderComponent } from './welcome-header.component';

describe('WelcomeHeaderComponent', () => {
  let component: WelcomeHeaderComponent;
  let fixture: ComponentFixture<WelcomeHeaderComponent>;
  let authService: AuthService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [WelcomeHeaderComponent],
      providers: [{ provide: AuthService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeHeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    authService.getUserAsync = jasmine.createSpy('getUserAsync');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBackClick method', () => {
    it('should navigate to policy page', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(authService.getUserAsync).toHaveBeenCalled();
    });
  });

  describe('buildTranslationKey method', () => {
    it('should build correct translation key', () => {
      // Arrange
      const relativeKey = 'fake-relative-key';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`welcomePage.${relativeKey}`);
    });
  });
});
