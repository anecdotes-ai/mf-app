import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService, WindowHelperService } from 'core';
import { AuthService, FirebaseWrapperService, TenantFacadeService } from 'core/modules/auth-core/services';
import { EvidenceService, PolicyService } from 'core/modules/data/services';
import firebase from 'firebase/app';
import { configureTestSuite } from 'ng-bullet';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { ExternalApprovalComponent } from './external-approval.component';

describe('ExternalApprovalComponent', () => {
  configureTestSuite();

  let component: ExternalApprovalComponent;
  let fixture: ComponentFixture<ExternalApprovalComponent>;

  let windowHelper: WindowHelperService;
  let loaderManager: LoaderManagerService;
  let authService: AuthService;
  let firebaseWrapperService: FirebaseWrapperService;
  let tenantFacade: TenantFacadeService;
  let policyService: PolicyService;
  let evidenceService: EvidenceService;

  let isAuthenticated: boolean;
  const decodedJwt: any = { anecdotes: { user: 'test@test.com' } };
  const user = { displayName: 'user' } as firebase.User;
  const exchangeResult = { code: 'some-link', tenant_id: 'some-tenant-id' };
  const jwt = 'some-jwt';
  const policyId = 'policyId';
  const approverType = 'owner';
  const evidence_instance_id = 'evidence_instance_id';
  const evidence_name = 'evidence_name';
  const policy = { evidence: { evidence_instance_id, evidence_name } };
  const evidenceFile = new File([], 'name');

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), PerfectScrollbarModule],
      declarations: [ExternalApprovalComponent],
      providers: [
        { provide: WindowHelperService, useValue: {} },
        { provide: LoaderManagerService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: FirebaseWrapperService, useValue: {} },
        { provide: TenantFacadeService, useValue: {} },
        { provide: PolicyService, useValue: {} },
        { provide: EvidenceService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (param) => param === 'jwt' ? jwt : approverType
              },
              paramMap: {
                get: () => policyId,
              },
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalApprovalComponent);
    component = fixture.componentInstance;

    windowHelper = TestBed.inject(WindowHelperService);
    loaderManager = TestBed.inject(LoaderManagerService);
    authService = TestBed.inject(AuthService);
    firebaseWrapperService = TestBed.inject(FirebaseWrapperService);
    tenantFacade = TestBed.inject(TenantFacadeService);
    policyService = TestBed.inject(PolicyService);
    evidenceService = TestBed.inject(EvidenceService);

    component.jwtDecoder = jasmine.createSpy('jwtDecoder').and.callFake(() => decodedJwt);

    windowHelper.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');

    loaderManager.show = jasmine.createSpy('show');
    loaderManager.hide = jasmine.createSpy('hide');

    authService.isAuthenticatedAsync = jasmine
      .createSpy('isAuthenticatedAsync')
      .and.callFake(() => Promise.resolve(isAuthenticated));
    authService.signOutWithoutRedirectAsync = jasmine.createSpy('signOutWithoutRedirectAsync');

    firebaseWrapperService.getCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue(user);
    firebaseWrapperService.setTenantId = jasmine.createSpy('setTenantId');
    firebaseWrapperService.isSignInWithEmailLink = jasmine.createSpy('isSignInWithEmailLink').and.returnValue(true);
    firebaseWrapperService.signInWithEmailLinkAsync = jasmine
      .createSpy('signInWithEmailLinkAsync')
      .and.returnValue({ user });

    tenantFacade.exchangeTokenAsync = jasmine.createSpy('exchangeTokenAsync').and.returnValue(exchangeResult);

    policyService.getPolicy = jasmine.createSpy('getPolicy').and.returnValue(of(policy));
    policyService.approvePolicy = jasmine.createSpy('approvePolicy').and.returnValue(of({}));
    evidenceService.downloadEvidence = jasmine.createSpy('downloadEvidence').and.returnValue(of(evidenceFile));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`externalApproval.${relativeKey}`);
    });
  });

  describe('#viewLinkedFile', () => {
    it('should open evidence_url in new tab', () => {
      // Arrange
      const evidence_url = 'some-url';
      component.policy = { evidence: { evidence_url } };

      // Act
      component.viewLinkedFile();

      // Assert
      expect(windowHelper.openUrlInNewTab).toHaveBeenCalledWith(evidence_url);
    });
  });

  describe('#ngOnInit', () => {
    it('should show loader', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(loaderManager.show).toHaveBeenCalled();
    });

    it('should set current firebase user to approverUser if user is authenticated', async () => {
      // Arrange
      isAuthenticated = true;

      // Act
      await detectChanges();

      // Assert
      expect(component.approverUser).toEqual(user);
    });

    describe('authentication', () => {
      beforeEach(() => {
        isAuthenticated = false;
      });

      it('should exchange jwt token from params', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(tenantFacade.exchangeTokenAsync).toHaveBeenCalledWith(jwt);
      });

      it('should set tenant_id to firebase from exchange result', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(firebaseWrapperService.setTenantId).toHaveBeenCalledWith(exchangeResult.tenant_id);
      });

      it('should sign in to firebase and set approverUser', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(firebaseWrapperService.isSignInWithEmailLink).toHaveBeenCalledWith(exchangeResult.code);
        expect(firebaseWrapperService.signInWithEmailLinkAsync).toHaveBeenCalledWith(
          decodedJwt.anecdotes.user,
          exchangeResult.code
        );
        expect(component.approverUser).toEqual(user);
      });
    });

    it('should set expirationDate from token', async () => {
      // Arrange
      const today = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(today.getDate() + 1);
      const unixTimestamp = expirationDate.getTime() / 1000;

      decodedJwt.anecdotes.exp = unixTimestamp;

      // Act
      await detectChanges();

      // Assert
      expect(component.expirationDate).toEqual(expirationDate);
    });

    it('should emit isLinkValid$ with false if token expired', async () => {
      // Arrange
      const today = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(today.getDate() - 1);
      const unixTimestamp = expirationDate.getTime() / 1000;

      decodedJwt.anecdotes.exp = unixTimestamp;

      // Act
      await detectChanges();

      // Assert
      expect(component.isLinkValid$.value).toBeFalse();
    });

    describe('policy data fetching', () => {
      beforeEach(() => {
        const today = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(today.getDate() + 1);
        const unixTimestamp = expirationDate.getTime() / 1000;

        decodedJwt.anecdotes.exp = unixTimestamp;
      });

      it('should get policy from policyService', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(policyService.getPolicy).toHaveBeenCalledWith(policyId);
        expect(component.policy).toEqual(policy);
      });

      it('should get evidence file from evidenceService', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(evidenceService.downloadEvidence).toHaveBeenCalledWith(evidence_instance_id);
        expect(component.file).toEqual(evidenceFile);
      });

      it('should emit isAllLoaded$ with true', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(component.isAllLoaded$.value).toBeTrue();
      });

      it('should hide loader', async () => {
        // Act
        await detectChanges();

        // Assert
        expect(loaderManager.hide).toHaveBeenCalled();
      });
    });
  });

  describe('#submitApproval', () => {
    it('should emit isSubmitting$ with true', async () => {
      // Act
      await component.submitApproval();

      // Assert
      expect(component.isSubmitting$.value).toBeTrue();
    });

    it('should call policyService.approvePolicy with correct policyId and comments', () => {
      // Arrange
      const comment = 'some-comment';
      component.noteControl.setValue(comment);

      // Act
      component.submitApproval();

      // Assert
      expect(policyService.approvePolicy).toHaveBeenCalledWith(policyId, comment, approverType);
    });

    it('should emit isSubmitted$ with true after successful approval', async () => {
      // Act
      component.submitApproval();
      await detectChanges();

      // Assert
      expect(component.isSubmitted$.value).toBeTrue();
    });

    it('should sign out after successful approval', async () => {
      // Act
      component.submitApproval();
      await detectChanges();

      // Assert
      expect(authService.signOutWithoutRedirectAsync).toHaveBeenCalled();
    });
  });
});
