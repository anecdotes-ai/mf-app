import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoaderManagerService, TipTypeEnum, WindowHelperService } from 'core';
import { AuthService, FirebaseWrapperService, TenantFacadeService } from 'core/modules/auth-core/services';
import { ApproverTypeEnum, Policy } from 'core/modules/data/models/domain';
import { EvidenceService, PolicyService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import firebase from 'firebase/app';
import jwtDecode from 'jwt-decode';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-external-approval-component',
  templateUrl: './external-approval.component.html',
  styleUrls: ['./external-approval.component.scss'],
})
export class ExternalApprovalComponent implements OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  policy: Policy;
  file: File;
  approverUser: firebase.User;
  expirationDate: Date;

  checkboxValue = false;
  noteControl = new FormControl('');
  tipTypes = TipTypeEnum;
  shouldLogOut = true;

  isAllLoaded$ = new BehaviorSubject(false);
  isLinkValid$ = new BehaviorSubject(true);
  isSubmitted$ = new BehaviorSubject(false);
  isSubmitting$ = new BehaviorSubject(false);

  footerNoBackground$: Observable<boolean>;

  jwtDecoder = jwtDecode;

  @ViewChild('scrollbar', { static: true })
  private perfectScrollBar: PerfectScrollbarComponent;

  constructor(
    private route: ActivatedRoute,
    private policyService: PolicyService,
    private evidenceService: EvidenceService,
    private windowHelper: WindowHelperService,
    private loaderManager: LoaderManagerService,
    private tenantFacade: TenantFacadeService,
    private firebaseWrapperService: FirebaseWrapperService,
    private authService: AuthService,
    private domSanitized: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    this.footerNoBackground$ = combineLatest([this.isLinkValid$, this.isSubmitted$]).pipe(
      map(([isLinkValid, isSubmitted]) => !isLinkValid || isSubmitted)
    );

    this.loaderManager.show();

    try {
      const { email, exp } = this.extractPropertiesFromJwt();

      if (await this.authService.isAuthenticatedAsync()) {
        this.approverUser = this.firebaseWrapperService.getCurrentUser();
        this.shouldLogOut = false;
      } else {
        await this.authenticate(email);
      }

      if (this.getIsLinkExpired(exp)) {
        this.isLinkValid$.next(false);
      } else {
        this.getPolicyData();
      }
    } catch {
      this.handleError();
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `externalApproval.${relativeKey}`;
  }

  viewLinkedFile(): void {
    this.windowHelper.openUrlInNewTab(this.policy.evidence.evidence_url);
  }

  async submitApproval(): Promise<void> {
    this.isSubmitting$.next(true);

    const policyId = this.route.snapshot.paramMap.get('policyId');
    const approveType = this.route.snapshot.queryParamMap.get('approver_type') as ApproverTypeEnum;
    await this.policyService.approvePolicy(policyId, this.noteControl.value, approveType).pipe(take(1)).toPromise();
    if (this.shouldLogOut) {
      await this.authService.signOutWithoutRedirectAsync();
    }
    this.isSubmitted$.next(true);
    this.perfectScrollBar.directiveRef.scrollTo(0, 0);
  }

  private async authenticate(email: string): Promise<void> {
    const jwt = this.route.snapshot.queryParamMap.get('jwt');
    const { code, tenant_id } = await this.tenantFacade.exchangeTokenAsync(jwt);

    this.firebaseWrapperService.setTenantId(tenant_id);

    if (this.firebaseWrapperService.isSignInWithEmailLink(code)) {
      const result = await this.firebaseWrapperService.signInWithEmailLinkAsync(email, code);
      this.approverUser = result.user;
    }
  }

  private extractPropertiesFromJwt(): { email: string; exp: number } {
    const jwt = this.route.snapshot.queryParamMap.get('jwt');
    const {
      anecdotes: { user: email, exp },
    } = this.jwtDecoder<{ anecdotes: { user: string; exp: number } }>(jwt);

    return { email, exp };
  }

  private getIsLinkExpired(exp: number): boolean {
    this.expirationDate = new Date(exp * 1000); // exp is Unix timestamp in seconds
    return this.expirationDate <= new Date();
  }

  private getPolicyData(): void {
    const policyId = this.route.snapshot.paramMap.get('policyId');

    this.policyService
      .getPolicy(policyId)
      .pipe(
        switchMap((policy) =>
          this.evidenceService
            .downloadEvidence(policy.evidence.evidence_instance_id)
            .pipe(map((file) => ({ policy, file })))
        ),
        map(({ policy, file }) => ({ policy: this.sanitizePolicy(policy), file })),
        this.detacher.takeUntilDetach()
      )
      .subscribe(
        ({ policy, file }) => {
          this.policy = policy;
          this.file = new File([file], policy.evidence.evidence_name);
          this.isAllLoaded$.next(true);
          this.loaderManager.hide();
        },
        () => this.handleError()
      );
  }

  private handleError(): void {
    this.isAllLoaded$.next(true);
    this.isLinkValid$.next(false);
    this.loaderManager.hide();
  }

  private sanitizePolicy(policy: Policy): Policy {
    policy.policy_name = this.domSanitized.sanitize(SecurityContext.HTML, policy.policy_name);
    return policy;
  }
}
