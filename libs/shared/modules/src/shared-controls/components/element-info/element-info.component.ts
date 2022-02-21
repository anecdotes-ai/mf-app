import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RegularDateFormat } from 'core/constants/date';
import { ResourceType } from 'core/modules/data/models';
import { DataAggregationFacadeService } from 'core/modules/data/services';
import { RequirementLike } from 'core/modules/shared-controls/models/index';
import { isNumber, SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-element-info',
  templateUrl: './element-info.component.html',
  styleUrls: ['./element-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementInfoComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private frameworks: string[];

  @Input()
  requirementLike: RequirementLike;

  get editTimeDate(): Date {
    if(!this.requirementLike) {
      return null;
    }

    return new Date(isNumber(this.requirementLike.lastEditTime) ? this.requirementLike.lastEditTime * 1000 : this.requirementLike.lastEditTime);
  }

  get isFrameworksNotEmpty(): boolean {
    return !!this.frameworks?.length;
  }

  dateFormat = RegularDateFormat;

  constructor(private dataAggregationFacadeService: DataAggregationFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.extractRelatedFrameworks();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `components.elementInfo.${relativeKey}`;
  }

  prepareFrameworksToString(): string {
    return this.frameworks?.join(', ');
  }

  private extractRelatedFrameworks(): void {
    if(this.isPolicy){
      if(this.requirementLike.relatedFrameworksNames) {
        this.frameworks = Object.keys(this.requirementLike.relatedFrameworksNames);
      }
    } else if(this.isRequirement) {
        this.dataAggregationFacadeService.getRequirementRelatedFrameworks(this.requirementLike.resourceId).pipe(this.detacher.takeUntilDetach()).subscribe(controlRelatedFrameworks => {
        this.frameworks = controlRelatedFrameworks.map(crf => crf.framework.framework_name);
        this.cd.detectChanges();
      });
    }
  }

  private get isPolicy(): boolean {
    return this.requirementLike.resourceType === ResourceType.Policy;
  }

  private get isRequirement(): boolean {
    return this.requirementLike.resourceType === ResourceType.Requirement;
  }
}
