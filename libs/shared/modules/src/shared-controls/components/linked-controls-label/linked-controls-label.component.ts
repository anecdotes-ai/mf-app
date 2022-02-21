import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FrameworkReference } from 'core/modules/data/models';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { DataAggregationFacadeService, EvidenceFacadeService } from 'core/modules/data/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { LinkedEntitiesGroup, LinkedEntity } from 'core/modules/utils/types';
import { SubscriptionDetacher } from 'core/utils';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-linked-controls-label',
  templateUrl: './linked-controls-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkedControlsLabelComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private currentEvidence: EvidenceInstance;

  @Input()
  evidenceId: string;

  linkedControls: LinkedEntitiesGroup[];

  constructor(
    private controlsNavigatorService: ControlsNavigator,
    private dataAggregationService: DataAggregationFacadeService,
    private evidenceUserEventService: EvidenceUserEventService,
    private evidenceFacadeService: EvidenceFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLinkedControls();
    this.loadCurrentEvidence();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidencePool.${relativeKey}`;
  }

  viewControl(linkedEntity: LinkedEntity): void {
    const controlsAmount = this.linkedControls.reduce((result, linkedEntityGroup) => result + linkedEntityGroup.entities.length, 0);
    const frameworkNames = this.linkedControls.map(linkedEntityGroup => linkedEntityGroup.title);
    this.evidenceUserEventService.trackLinkedControlClickEvent(this.currentEvidence.evidence_name, frameworkNames, controlsAmount);
    this.controlsNavigatorService.navigateToEvidenceAsync(linkedEntity.id, this.evidenceId);
  }

  private loadCurrentEvidence(): void {
    this.evidenceFacadeService.getEvidence(this.evidenceId).pipe(this.detacher.takeUntilDetach()).subscribe(evidence => this.currentEvidence = evidence);
  }

  private loadLinkedControls(): void {
    this.dataAggregationService.getEvidenceReferences(this.evidenceId).pipe(
      map((references) => this.sortFrameworks(references)),
      map((refs) => {
        return refs.map(
          (ref) =>
            ({
              title: ref.framework.framework_name,
              entities: ref.controls.map((control) => ({ title: control.control_name, id: control.control_id })),
            })
        );
      }),
      shareReplay()
    ).pipe(this.detacher.takeUntilDetach()).subscribe(linkedControls => {
      this.linkedControls = linkedControls;
      this.cd.detectChanges();
    });
  }

  private sortFrameworks(frameworks: FrameworkReference[]): FrameworkReference[] {
    return frameworks.sort((a, b) => a.framework.framework_name.localeCompare(b.framework.framework_name));
  }
}
