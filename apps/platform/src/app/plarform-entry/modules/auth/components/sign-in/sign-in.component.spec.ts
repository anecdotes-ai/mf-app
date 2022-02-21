import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService } from 'core';
import { Tenant } from 'core/modules/auth-core/models/domain';
import { FirebaseWrapperService, TenantFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { configureTestSuite } from 'ng-bullet';
import { SignInComponent } from './sign-in.component';
import { SignInComponentIds, SignInContext } from '../../models';
import { of } from 'rxjs';

describe('SignInComponent', () => {
  configureTestSuite();
  let componentUnderTest: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let domSanitizer: DomSanitizer;
  let fakeTenant: Tenant;
  let firebaseWrapperService: FirebaseWrapperService;
  let loaderManagerService: LoaderManagerService;

  let tenantFacade: TenantFacadeService;
  let componentSwitcherMock: ComponentSwitcherDirective;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SignInComponent],
      providers: [
        { provide: TenantFacadeService, useValue: {} },
        { provide: DomSanitizer, useValue: {} },
        { provide: LoaderManagerService, useValue: {} },
        { provide: FirebaseWrapperService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    tenantFacade = TestBed.inject(TenantFacadeService);
    firebaseWrapperService = TestBed.inject(FirebaseWrapperService);
    domSanitizer = TestBed.inject(DomSanitizer);
    loaderManagerService = TestBed.inject(LoaderManagerService);
    componentSwitcherMock = TestBed.inject(ComponentSwitcherDirective);
    componentUnderTest = fixture.componentInstance;

    tenantFacade.getCurrentTenantAsync = jasmine
      .createSpy('getCurrentTenant')
      .and.callFake(() => Promise.resolve(fakeTenant));
    domSanitizer.bypassSecurityTrustUrl = jasmine.createSpy('bypassSecurityTrustUrl');
    firebaseWrapperService.setTenantId = jasmine.createSpy('setTenantId');
    loaderManagerService.hide = jasmine.createSpy('hide');
    loaderManagerService.show = jasmine.createSpy('show');
    fakeTenant = {
      idps: [],
      tenant_id: 'fake',
      tenant_logo: 'fake/logo.png',
    };
    componentSwitcherMock.changeContext = jasmine.createSpy('changeContext');
    componentSwitcherMock.goById = jasmine.createSpy('goById');
    componentSwitcherMock.sharedContext$ = of({});
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('buildTranslationKey()', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should return full translation key', () => {
      // Arrange
      const relativeKey = 'fakeRelativeKey';

      // Act
      const actuallFullKey = componentUnderTest.buildTranslationKey(relativeKey);

      // Assert
      expect(actuallFullKey).toBe(`auth.${relativeKey}`);
    });
  });

  describe('ngOnInit()', () => {
    it('should call getCurrentTenant', async () => {
      // Arrange

      // Act
      await detectChanges();

      // Assert
      expect(tenantFacade.getCurrentTenantAsync).toHaveBeenCalled();
    });

    it('should not define component idps when empty idps array comes in tenant', async () => {
      // Arrange

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.idps).toBeFalsy();
    });

    it('should define component idps when is not empty idps array comes in tenant', async () => {
      // Arrange
      fakeTenant.idps.push({ idp_id: 'id', idp_type: 'type' });
      tenantFacade.getCurrentTenantAsync = jasmine
        .createSpy('getCurrentTenant')
        .and.callFake(() => Promise.resolve(fakeTenant));

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.idps).toBeTruthy();
    });

    it('should set displayEmailLogin to true when email idp_type comes in tenant idps ', async () => {
      // Arrange
      fakeTenant.idps.push({ idp_id: 'id', idp_type: 'email_sign_in' });
      tenantFacade.getCurrentTenantAsync = jasmine
        .createSpy('getCurrentTenant')
        .and.callFake(() => Promise.resolve(fakeTenant));

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.displayEmailLogin).toBeTrue();
    });
  });

  describe('handleSignInEmailSent()', () => {
    const fakeEnteredEmail = 'a@ex.com';

    it('should call changeContext() with provided enteredEmail', async () => {
      // Arrange
      // Act
      await componentUnderTest.handleSignInEmailSent(fakeEnteredEmail);

      // Assert
      expect(componentSwitcherMock.changeContext).toHaveBeenCalledWith({ confirmation: { enteredEmail: fakeEnteredEmail } } as SignInContext);
    });

    it('should change switcher context with provided enteredEmail', async () => {
      // Arrange
      // Act
      await componentUnderTest.handleSignInEmailSent(fakeEnteredEmail);

      // Assert
      expect(componentSwitcherMock.goById).toHaveBeenCalledWith(SignInComponentIds.ConfirmationPage);
    });
  });
});
