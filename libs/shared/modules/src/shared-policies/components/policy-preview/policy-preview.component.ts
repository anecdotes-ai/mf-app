import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RegularDateFormatMMMdyyyy } from 'core/constants/date';
import { CalculatedPolicy } from 'core/modules/data/models';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-policy-preview',
  templateUrl: './policy-preview.component.html',
  styleUrls: ['./policy-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyPreviewComponent implements OnInit {
  // ** Inputs **

  @Input()
  policyId: string;

  @Input()
  policyContext: boolean;

  @Input()
  isPreviewFromControls = false;

  // ** Outputs **

  @Output()
  viewDocument = new EventEmitter(true);

  // ** Public properties **

  policy: CalculatedPolicy;

  // ** Constants **

  dateFormat = RegularDateFormatMMMdyyyy;
  translateKey = 'policyManager.policyPreview';

  // ** Getters **

  get hasSchedules(): boolean {
    return !!this.policy?.policy_settings?.scheduling.approval_frequency;
  }

  get hasPreview(): boolean {
    return this.policy?.has_roles || this.hasSchedules;
  }

  isLoaded = false;

  constructor(
    private policyModalService: PolicyModalService,
    private policiesFacade: PoliciesFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  // **** Lifecycle hooks ****

  async ngOnInit(): Promise<void> {
    this.policy = await this.policiesFacade.getPolicy(this.policyId).pipe(take(1)).toPromise();
    this.isLoaded = true;

    this.cd.detectChanges();
  }

  // **** Translation key built ****

  buildTranslationKey(relativeKey: string): string {
    return `${this.translateKey}.${relativeKey}`;
  }

  // **** DOM Interaction Methods ****

  openFullDocumentClick(): void {
    this.viewDocument.emit();
  }

  openPolicySettings(): void {
    this.policyModalService.addPolicySettingsModal({ policyId: this.policy.policy_id });
  }
}
