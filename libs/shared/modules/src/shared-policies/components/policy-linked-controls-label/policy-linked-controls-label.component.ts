import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalculatedPolicy } from 'core/modules/data/models';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { DataAggregationFacadeService } from 'core/modules/data/services/facades/data-aggregation-facade/data-aggregation-facade.service';
import { ControlsNavigator } from 'core/modules/shared-controls/services/controls-navigator/controls-navigator.service';
import { LinkedEntitiesGroup, LinkedEntity } from 'core/modules/utils/types';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { SubscriptionDetacher } from 'core/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-policy-linked-controls-label',
  templateUrl: './policy-linked-controls-label.component.html',
  styleUrls: ['./policy-linked-controls-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyLinkedControlsLabelComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private currentPolicy: CalculatedPolicy;

  @Input()
  policyId: string;

  linkedControls: LinkedEntitiesGroup[];

  constructor(
    private controlsNavigatorService: ControlsNavigator,
    private dataAggregationService: DataAggregationFacadeService,
    private policyManagerEventService: PolicyManagerEventService,
    private policyFacadeService: PoliciesFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLinkedControls();
    this.loadCurrentPolicy();
  }

  ngOnDestroy(): void {
    this.detacher.takeUntilDetach();
  }

  viewControl(linkedEntity: LinkedEntity): void {
    const frameworkNames = this.linkedControls.map((linkedEntityGroup) => linkedEntityGroup.title);
    this.policyManagerEventService.trackLinkedControlClickEvent(this.currentPolicy, frameworkNames, this.getControlsAmount());
    this.controlsNavigatorService.navigateToControlAsync(linkedEntity.id);
  }

  buildTranslationKey(relativeKey: string): string {
    return `policyManager.${relativeKey}`;
  }

  private getControlsAmount(): number {
    return this.linkedControls.reduce(
      (result, linkedEntityGroup) => result + linkedEntityGroup.entities.length,
      0
    );
  }

  private loadLinkedControls(): void {
    this.dataAggregationService
      .getPolicyReferences(this.policyId)
      .pipe(
        map((refs) => {
          return refs.map((ref) => ({
            title: ref.framework.framework_name,
            entities: ref.controls.map((control) => ({ title: control.control_name, id: control.control_id })),
          }));
        })
      )
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((linkedControls) => {
        this.linkedControls = linkedControls;
        this.cd.detectChanges();
      });
  }

  private loadCurrentPolicy(): void {
    this.policyFacadeService
      .getPolicy(this.policyId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((policy) => (this.currentPolicy = policy));
  }
}
