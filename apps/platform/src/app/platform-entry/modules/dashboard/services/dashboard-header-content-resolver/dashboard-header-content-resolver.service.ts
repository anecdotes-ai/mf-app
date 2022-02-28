import { DashboardHeaderData } from '../../models';
import { Injectable } from '@angular/core';
import { SpecificInformationContentValueTypes } from 'core';
import { DashboardHeaderItem } from '../../models';
import { Service, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class DashboardHeaderContentResolverService {
  constructor() { }

  public getHeaderSectionData(
    services: Service[],
    frameworksControls: CalculatedControl[],
    applicableFrameworksIds: string[],
    controlFrameworkMapping: { [key: string]: string }
  ): DashboardHeaderData {

    // we want to create group of unique collected evidence per each applicable framework
    const frameworkEvidenceMap = {};
    applicableFrameworksIds.forEach((framework_id) => (frameworkEvidenceMap[framework_id] = []));

    const applicableControls = frameworksControls.filter(
      (control) => control.control_is_applicable && control.control_id in controlFrameworkMapping
    );

    let automatedEvidences = 0;
    let roiCalculated = 0;

    // list of all the combined evidence from all frameworks (including duplicated)
    if (applicableControls.length && applicableFrameworksIds.length) {
      // we want to add each control's applicable evidence to the framework evidence list
      applicableControls.forEach((control) => {
        const frameworkId = controlFrameworkMapping[control.control_id];
        frameworkEvidenceMap[frameworkId] = [
          ...frameworkEvidenceMap[frameworkId],
          ...control.control_collected_automated_applicable_evidence_ids,
        ];
      });
      // then remove duplicated evidence in each framework's automated evidence list and sum them up
      const combinedFrameworkEvidence = Object.keys(frameworkEvidenceMap)
        .map((f) => [...new Set(frameworkEvidenceMap[f])])
        ?.reduce((acc, curr) => acc.concat(curr));

      // remove all duplicates of all evidence (cross-platform)
      automatedEvidences = [...new Set(combinedFrameworkEvidence)].length;

      // # of unique automated evidence collected per each framework * 300
      roiCalculated = combinedFrameworkEvidence.length * 300;
    }

    return {
      connectedPlugins: services.filter((service) => service.service_status === ServiceStatusEnum.INSTALLED).length,
      applicableControls: applicableControls.length,
      automatedEvidence: automatedEvidences,
      savedThisYear: roiCalculated,
    };
  }

  public getHeaderItems(headerData: DashboardHeaderData): DashboardHeaderItem[] {
    return [
      this.getConnectedPluginsItem(headerData),
      this.getApplicableControlsItem(headerData),
      this.getAutomatedEvidencesItem(headerData),
      this.getSavedAmount(headerData),
    ];
  }

  // Connected plugins
  // Number of plugins connected
  private getConnectedPluginsItem(headerData: DashboardHeaderData): DashboardHeaderItem {
    return {
      icon: 'dashboard/plugins',
      value: headerData.connectedPlugins,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'items.connectedPlugins',
    };
  }

  // Number of applicable controls
  private getApplicableControlsItem(headerData: DashboardHeaderData): DashboardHeaderItem {
    return {
      icon: 'applicable',
      value: headerData.applicableControls,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'items.applicableControls',
    };
  }

  // [# of automated evidence] * $300 * [# of applicable frameworks]
  private getSavedAmount(headerData: DashboardHeaderData): DashboardHeaderItem {
    return {
      icon: 'dashboard/ROI',
      value: headerData.savedThisYear,
      valueTypeToRepresent: SpecificInformationContentValueTypes.DOLLAR,
      descriptionTranslateKey: 'items.savedThisYear',
      informationText: 'items.howROICalculated',
    };
  }

  // Number of evidence collecged automatically (practically number of evidence instances)
  private getAutomatedEvidencesItem(headerData: DashboardHeaderData): DashboardHeaderItem {
    return {
      icon: 'dashboard/automated_evidence',
      value: headerData.automatedEvidence,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'items.automatedEvidences',
    };
  }
}
