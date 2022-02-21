/* tslint:disable:no-unused-variable */
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerService, WindowHelperService } from 'core';
import { Idp } from 'core/modules/auth-core/models/domain';
import { AuthService, FirebaseWrapperService } from 'core/modules/auth-core/services';
import { configureTestSuite } from 'ng-bullet';
import { IdpsLoginComponent } from './idps-login.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';

describe('IdpsLoginComponent', () => {
  configureTestSuite();

  let componentUnderTest: IdpsLoginComponent;
  let fixture: ComponentFixture<IdpsLoginComponent>;
  let sanitizerService: DomSanitizer;
  let authService: AuthService;
  let windowHelperService: WindowHelperService;
  let fakeIdp: Idp;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  function getloginUsingIdpButton(): DebugElement {
    return fixture.debugElement.query(By.css('app-button'));
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [IdpsLoginComponent],
      providers: [
        { provide: WindowHelperService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
        LoggerService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdpsLoginComponent);
    componentUnderTest = fixture.componentInstance;
    sanitizerService = TestBed.inject(DomSanitizer);
    authService = TestBed.inject(AuthService);
    windowHelperService = TestBed.inject(WindowHelperService);

    windowHelperService.redirectToOrigin = jasmine.createSpy('bypassSecurityTrustUrl');
    sanitizerService.bypassSecurityTrustUrl = jasmine.createSpy('bypassSecurityTrustUrl');
    windowHelperService.redirectToOrigin = jasmine.createSpy('redirectToOrigin');
    fakeIdp = { idp_id: 'fakeId', idp_type: 'fakeType' };
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('buildTranslationKey method', () => {
    it('should return full translation key', () => {
      // Arrange
      const relativeKey = 'fakeRelativeKey';

      // Act
      const actuallFullKey = componentUnderTest.buildTranslationKey(relativeKey);

      // Assert
      expect(actuallFullKey).toBe(`auth.${relativeKey}`);
    });
  });

  describe('loginWith-idp-button', () => {
    it('should call signIn method when clicked on button', async () => {
      // Arrange
      spyOn(componentUnderTest, 'loginUsingIdp');
      componentUnderTest.idps = [fakeIdp];

      // Act
      await detectChanges();
      getloginUsingIdpButton().triggerEventHandler('click', {});

      // Assert
      expect(componentUnderTest.loginUsingIdp).toHaveBeenCalledWith(componentUnderTest.idps[0]);
    });
  });

  describe('loginUsingIdp()', () => {
    it('should call signInWithPopupAsync with idp_id', async () => {
      // Arrange
      fakeIdp.idp_id = 'google.com';
      authService.signInWithPopupAsync = jasmine.createSpy('signInWithPopupAsync');

      // Act
      await detectChanges();
      await componentUnderTest.loginUsingIdp(fakeIdp);

      // Assert
      expect(authService.signInWithPopupAsync).toHaveBeenCalled();
    });

    it('should  not call redirectToOrigin when an error occurs', async () => {
      // Arrange
      const error: Error = new Error();
      fakeIdp.idp_id = 'asamla';
      authService.signInWithPopupAsync = jasmine
        .createSpy('signInWithPopupAsync')
        .and.returnValue(Promise.reject(error));

      // Act
      await detectChanges();
      await componentUnderTest.loginUsingIdp(fakeIdp);

      // Assert
      expect(windowHelperService.redirectToOrigin).not.toHaveBeenCalled();
    });

    it('should call redirectToOrigin when no errors occur in signInWithSamlAsync', async () => {
      // Arrange
      fakeIdp.idp_id = 'asamla';
      authService.signInWithPopupAsync = jasmine
        .createSpy('signInWithPopupAsync')
        .and.returnValue(Promise.resolve());

      // Act
      await detectChanges();
      await componentUnderTest.loginUsingIdp(fakeIdp);

      // Assert
      expect(windowHelperService.redirectToOrigin).toHaveBeenCalled();
    });
  });
});
