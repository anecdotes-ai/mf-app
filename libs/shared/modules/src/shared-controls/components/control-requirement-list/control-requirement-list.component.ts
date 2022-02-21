import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, skip } from 'rxjs/operators';
import { ControlContextService } from '../..';
import { RequirementCustomizationModalService } from '../../modules/customization/requirement/services';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-control-requirement-list',
  templateUrl: './control-requirement-list.component.html',
  styleUrls: ['./control-requirement-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlRequirementListComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  private detacher = new SubscriptionDetacher();
  private displayedRequirementIds: Set<string>;
  private newRequirementIds: Set<string>;
  private requirementNameWithRecentlyAddedEvidence: string;

  controlRequirements$: Observable<CalculatedRequirement[]>;
  ignoredRequirementsCount$: Observable<number>;
  showedRequirementsCount$: Observable<number>;

  @Input()
  controlInstance: CalculatedControl;

  @Input()
  framework: Framework;

  @Input() displayedRequirementsAndEvidences: { requirement_id: string; evidence_ids: string[] }[] = [];

  @Input()
  viewOnly?: boolean;

  ignoredRequirementsExist$: Observable<boolean>;

  ignoredRequirementsShowed = true;

  areRequirementsExpanded = false;

  @HostBinding('class.in-audit')
  get isInAudit(): boolean {
    return this.context.isAudit;
  }

  get isReadonly(): boolean {
    return this.controlInstance?.is_snapshot;
  }

  constructor(
    private cd: ChangeDetectorRef,
    public context: ControlContextService,
    private controlsFacade: ControlsFacadeService,
    private requirementCustomizationModalService: RequirementCustomizationModalService,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('displayedRequirementsAndEvidences' in changes) {
      if (this.displayedRequirementsAndEvidences) {
        this.displayedRequirementIds = new Set(this.displayedRequirementsAndEvidences.map((x) => x.requirement_id));
      } else {
        delete this.displayedRequirementIds;
      }
    }
  }

  ngOnInit(): void {
    const currentExpandedControl$ = this.framework.is_snapshot ? 
      of(this.controlInstance) :
      this.controlsFacade.getSingleControlOrSnapshot(this.controlInstance.control_id);

    this.controlRequirements$ = currentExpandedControl$.pipe(
      filter((x) => !!x),
      map((x) => x.control_calculated_requirements),
      shareReplay()
    );

    this.ignoredRequirementsExist$ = currentExpandedControl$.pipe(
      map((x) =>
        x?.control_calculated_requirements.some(
          (r) => !r.requirement_applicability || r.requirement_related_evidences?.some((e) => !e.is_applicable)
        )
      )
    );

    this.ignoredRequirementsCount$ = this.controlRequirements$.pipe(
      map((requirements) => {
        const ignoredReqs = requirements.filter((r) => !r.requirement_applicability).length;
        const ignoredEvidences = requirements.reduce((prev, curr) => {
          return (prev += curr.requirement_related_evidences?.filter((ev) => !ev.is_applicable).length);
        }, 0);
        return ignoredReqs + ignoredEvidences;
      })
    );

    this.showedRequirementsCount$ = this.controlRequirements$.pipe(
      map((requirements) => requirements.filter((r) => r.requirement_applicability).length)
    );

    this.context
      .getControlNewRequirements(this.controlInstance.control_id)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((newIds) => {
        this.newRequirementIds = newIds;
        this.cd.detectChanges();
      });
    this.getRequirementName();
  }

  ngAfterViewInit(): void {
    // timeout is set to avoid exclusion in lifecycle when data is set but render is not finished
    // should be changed when more viable solution is found for scrolling to elements
    setTimeout(() => { this.scrollToRequirement(); }, 250);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  isRequirementHidden(req: ControlRequirement): boolean {
    if (!this.isInAudit) {
      const isHiddenByFilter = !this.displayedRequirementIds?.has(req.requirement_id);
      const isNotNew = !this.newRequirementIds.has(req.requirement_id);
      return isNotNew && isHiddenByFilter;
    }

    return false;
  }

  buildTraslationKey(relativeKey: string): string {
    return `requirements.${relativeKey}`;
  }

  reqTrackBy(index: number, req: ControlRequirement): any {
    return req ? req.requirement_id : index;
  }

  toggleIgnoredReq(): void {
    this.ignoredRequirementsShowed = !this.ignoredRequirementsShowed;
    this.cd.detectChanges();
  }

  openAddRequirementModal(): void {
    this.requirementCustomizationModalService.openAddRequirementModal(
      this.controlInstance.control_id,
      this.framework.framework_id
    );
  }

  expandAllRequirements(): void {
    this.areRequirementsExpanded = true;
    this.cd.detectChanges();
  }

  collapseAllRequirements(): void {
    this.areRequirementsExpanded = false;
    this.cd.detectChanges();
  }

  private getRequirementName(): void {
    this.route.queryParams.pipe(this.detacher.takeUntilDetach()).subscribe((params) => {
      this.requirementNameWithRecentlyAddedEvidence = params.requirement;
    });
  }

  private scrollToRequirement(): void {
    // It looks a bit strange. So we need to come up with some generic mechanizm for scrolling into controls, requirements, evidence
    let XPath = `//span[contains(., '${this.requirementNameWithRecentlyAddedEvidence}')]`;
    if (document.evaluate(XPath, document, null, XPathResult.ANY_TYPE, null).iterateNext() !== null) {
      document
        .evaluate(XPath, document, null, XPathResult.ANY_TYPE, null)
        .iterateNext()
        .parentElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
