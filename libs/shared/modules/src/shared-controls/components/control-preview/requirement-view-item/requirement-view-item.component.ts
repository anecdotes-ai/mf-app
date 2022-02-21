import { Component, Input, OnInit } from '@angular/core';
import { CalculatedRequirement } from 'core/modules/data/models';
import { convertToRequirementLike, RequirementLike } from 'core/modules/shared-controls/models';

@Component({
  selector: 'app-requirement-view-item',
  templateUrl: './requirement-view-item.component.html',
})
export class RequirementViewItemComponent implements OnInit {
  @Input()
  requirement: CalculatedRequirement;

  reqLike: RequirementLike;
  evidenceIds: string[];

  ngOnInit(): void {
    this.reqLike = convertToRequirementLike(this.requirement);
    this.evidenceIds = this.requirement?.requirement_related_evidences?.filter((evidence) => !!evidence).map((evidence) => evidence.id);
  }

  buildTranslationKey(key: string): string {
    return `controlPreview.reqViewItem.${key}`;
  }
}
