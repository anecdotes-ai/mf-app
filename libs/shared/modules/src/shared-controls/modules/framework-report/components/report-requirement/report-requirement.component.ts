import { Component, Input, OnInit } from '@angular/core';
import { CalculatedRequirement } from 'core/modules/data/models';
import { PluginService } from 'core/modules/data/services';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-report-requirement',
  templateUrl: './report-requirement.component.html',
  styleUrls: ['./report-requirement.component.scss'],
})
export class ReportRequirementComponent implements OnInit {
  @Input()
  requirement: CalculatedRequirement;

  pluginsIcons: Observable<string[]>;

  constructor(private pluginService: PluginService) {}

  ngOnInit(): void {
    this.pluginsIcons = combineLatest(
      this.requirement.requirement_related_evidences
        .map((evidence) => evidence.service_id)
        .map((id) => this.pluginService.getServiceIconLink(id))
    ).pipe(map((icons) => [...new Set(icons)]));
  }

  buildTranslationKey(key: string): string {
    return `frameworkReport.reportRequirement.${key}`;
  }
}
