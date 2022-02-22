/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerService } from 'core';
import { DynamicFormOutletMockComponent } from 'core/mocks';
import { TenantFacadeService, TenantSubDomainExtractorService } from 'core/modules/auth-core/services';
import { configureTestSuite } from 'ng-bullet';
import { EmailLoginComponent } from './email-login.component';

describe('EmailLoginComponent', () => {
  configureTestSuite();
  let componentUnderTest: EmailLoginComponent;
  let fixture: ComponentFixture<EmailLoginComponent>;
  let activatedRouteMock: ActivatedRoute;
  let tenantFacadeMock: TenantFacadeService;
  let tenantSubDomainExtractorMock: TenantSubDomainExtractorService;

  let fakeTenantSubdomain: string;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  function getSignInButton(): DebugElement {
    return fixture.debugElement.query(By.css('#sign-in-btn'));
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TenantFacadeService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: TenantSubDomainExtractorService, useValue: {} },
        LoggerService,
      ],
      declarations: [EmailLoginComponent, DynamicFormOutletMockComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLoginComponent);
    componentUnderTest = fixture.componentInstance;
    activatedRouteMock = TestBed.inject(ActivatedRoute);
    tenantFacadeMock = TestBed.inject(TenantFacadeService);
    tenantSubDomainExtractorMock = TestBed.inject(TenantSubDomainExtractorService);
    (activatedRouteMock as any).snapshot = {
      queryParams: {},
    };
    fakeTenantSubdomain = 'fake';
    tenantSubDomainExtractorMock.getCurrentTenantSubDomain = jasmine
      .createSpy('getTenantSubDomain')
      .and.returnValue(fakeTenantSubdomain);
    tenantFacadeMock.sendSignInEmailAsync = jasmine
      .createSpy('sendSignInEmailAsync')
      .and.returnValue(Promise.resolve());
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('dynamic form outlet', () => {
    it('should be passed into dynamic form group outlet component', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(
        (
          fixture.debugElement.query(By.directive(DynamicFormOutletMockComponent))
            .componentInstance as DynamicFormOutletMockComponent
        ).dynamicFormGroup
      ).toBe(componentUnderTest.dynamicFormGroup);
    });
  });

  describe('sign-in-button', () => {
    it('should have disabled class when formGroup is invalid', async () => {
      // Arrange
      spyOnProperty(componentUnderTest.dynamicFormGroup, 'invalid').and.returnValue(true);

      // Act
      await detectChanges();

      // Assert
      expect(getSignInButton().classes['disabled']).toBeTrue();
    });

    it('should not have disabled class when formGroup is valid', async () => {
      // Arrange
      spyOnProperty(componentUnderTest.dynamicFormGroup, 'invalid').and.returnValue(false);

      // Act
      await detectChanges();

      // Assert
      expect(getSignInButton().classes['disabled']).toBeUndefined();
    });
  });

  describe('buildTranslationKey method', () => {
    it('should return passed value interpolated as `auth.form.${value}`', async () => {
      // Arrange
      const value = 'value';
      const expectedValue = `auth.emailPart.${value}`;

      // Act
      const returnedValue = componentUnderTest.buildTranslationKey(value);

      // Assert
      expect(returnedValue).toBe(expectedValue);
    });
  });

  describe('sendSignInLink()', () => {
    beforeEach(() => {
      spyOnProperty(componentUnderTest.dynamicFormGroup, 'valid').and.returnValue(true);
    });

    it('should call sendSignInEmailAsync', async () => {
      // Arrange
      // Act
      await componentUnderTest.sendSignInLink();

      // Assert
      expect(tenantFacadeMock.sendSignInEmailAsync).toHaveBeenCalledWith(
        String(componentUnderTest.dynamicFormGroup.items.email.value),
        fakeTenantSubdomain
      );
    });

    it('should emit signInEmailSent with email', async () => {
      // Arrange
      spyOn(componentUnderTest.signInEmailSent, 'emit');

      // Act
      await componentUnderTest.sendSignInLink();

      // Assert
      expect(componentUnderTest.signInEmailSent.emit).toHaveBeenCalledWith(
        componentUnderTest.dynamicFormGroup.items.email.value
      );
    });
  });

  describe('enter button pressed', () => {
    beforeEach(() => {
      componentUnderTest.sendSignInLink = jasmine.createSpy('signIn');
    });

    it('should call sendSignInLink method', () => {
      // Arrange
      const event = new KeyboardEvent('keydown', { key: 'enter' });

      // Act
      document.dispatchEvent(event);

      // Assert
      expect(componentUnderTest.sendSignInLink).toHaveBeenCalled();
    });
  });
});
