import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PluginService } from 'core/modules/data/services';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { SocTwoFrameworkName } from 'core/constants';
import { distinct } from 'core/utils';

@Component({
  selector: 'app-controls-report-item',
  templateUrl: './controls-report-item.component.html',
  styleUrls: ['./controls-report-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsReportItemComponent implements OnChanges {
  @Input()
  control: CalculatedControl;

  @Input()
  framework: Framework;

  control_criterias_by_comma: string;
  applicableRequirements: CalculatedRequirement[] = [];
  serviceIconPaths: WeakMap<CalculatedRequirement, Observable<string>[]> = new WeakMap();

  constructor(private pluginService: PluginService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('control' in changes) {
      this.applicableRequirements = this.control.control_calculated_requirements?.filter(
        (req) => req.requirement_applicability
      );
      this.applicableRequirements.forEach((req) => {
        this.serviceIconPaths.set(
          req,
          distinct(req.requirement_related_evidences.map((x) => x.service_id)).map((service_id) =>
            this.pluginService.getServiceIconLink(service_id)
          )
        );
      });
    }

    if ('framework' in changes && this.framework?.framework_name === SocTwoFrameworkName) {
      this.control_criterias_by_comma = this.control.control_related_frameworks_names[this.framework.framework_name]?.join(', ');
    }
  }

  buildTranslationKey(key: string): string {
    return `controls.report.requirementItem.${key}`;
  }
}
