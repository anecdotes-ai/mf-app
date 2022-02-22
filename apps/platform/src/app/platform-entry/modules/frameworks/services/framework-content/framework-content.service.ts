import { CalculatedControl } from 'core/modules/data/models';
import { Injectable } from '@angular/core';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworkContentRow } from '../../models/framework-content-row.model';
import { SpecificInformationContentValueTypes } from 'core/models/specific-information-content.model';
import { flattenAndDistinctArrays } from 'core/utils';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewFramework } from 'core/modules/data/constants';

@Injectable()
export class FrameworkContentService {
  constructor(private frameworksFacade: FrameworksFacadeService) {}

  /** Returns all frameworks including the mock new framework which is rendered as create your own framework */
  getDisplayedFrameworks(): Observable<Framework[]> {
    return this.frameworksFacade.getFrameworks().pipe(map((frameworks) => this.addNewFramework(frameworks)));
  }

  /** Returns all not applicable frameworks, including new framework */
  getNotApplicableFrameworks(): Observable<Framework[]> {
    return this.frameworksFacade
      .getNotApplicableFrameworks()
      .pipe(map((frameworks) => this.addNewFramework(frameworks)));
  }

  public getContentRows(framework: Framework, controls: CalculatedControl[]): FrameworkContentRow[] {
    return framework.is_applicable ? this.getApplicableRelatedContentRows(framework, controls) : [];
  }

  private getApplicableRelatedContentRows(framework: Framework, controls: CalculatedControl[]): FrameworkContentRow[] {
    return [this.getApplicableControlsRow(framework, controls), this.getEvidenceAutomationRow(framework, controls)];
  }

  private getApplicableControlsRow(framework: Framework, controls: CalculatedControl[]): FrameworkContentRow {
    const applicableControlsCount = controls.filter((control) => control.control_is_applicable).length;

    return {
      icon: 'applicable',
      value: applicableControlsCount,
      maxValue: framework.number_of_related_controls,
      valueTypeToRepresent: SpecificInformationContentValueTypes.DIVIDE,
      descriptionTranslateKey: 'contentRows.applicableControls',
      field: 'applicable',
      fieldValue: true,
    };
  }

  private getEvidenceAutomationRow(framework: Framework, controls: CalculatedControl[]): FrameworkContentRow {
    const filteredControls = controls.filter(
      (control) => control.control_has_automated_evidence_collected && control.control_is_applicable
    );
    const evidenceAutomation = flattenAndDistinctArrays(
      filteredControls.map((c) => c.control_collected_automated_applicable_evidence_ids)
    ).length;

    return {
      icon: 'automated_evidence',
      value: evidenceAutomation,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'contentRows.evidenceAutomation',
      field: 'automation',
      fieldValue: true,
    };
  }

  private addNewFramework(frameworks: Framework[]): Framework[] {
    frameworks.unshift(NewFramework);
    return frameworks;
  }
}
