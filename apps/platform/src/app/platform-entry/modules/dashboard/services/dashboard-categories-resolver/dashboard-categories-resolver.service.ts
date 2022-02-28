import { Injectable } from '@angular/core';
import { SpecificInformationContentValueTypes } from 'core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { CategoryCollectedData } from '../../models';
import { Category } from '../../models';
import { DefaultCategories } from '../../models/category';
import { getPercents } from 'core/utils/percentage.function';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class DashboardCategoriesResolverService {
  controlBaseline = DefaultCategories;

  getCategoryIcon(categoryName: string): string {
    const categoryIcon = categoryName.toString().replace(/\s+/g, '').toLocaleLowerCase();
    return `categories/${categoryIcon}`;
  }

  groupInCategories(controls: CalculatedControl[], useBaseLine = false, controlFramework?: Framework): Category[] {
    const groupedControls = [];
    const initialGroupInObject = {};
    if (useBaseLine) {
      this.controlBaseline.forEach(category => initialGroupInObject[category] = []);
    }
    if(controlFramework)
    {
      controls = this.filterControlsByFramework(controls, controlFramework);
    }

    const groupInObject = controls?.reduce((acc, control) => {
      const key = control.control_category;
      // if we use baseline, we want to add only categories which exist in the baseline
      if (!useBaseLine || this.controlBaseline.has(control.control_category)) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(control);
      }
      return acc;
    }, initialGroupInObject);
    for (const categoryName in groupInObject) {
      if (groupInObject.hasOwnProperty(categoryName)) {
        groupedControls.push({
          category_name: categoryName,
          // All controls in currently category
          values: groupInObject[categoryName],
          // length of control_has_automated_evidence_collected
          control_automated: groupInObject[categoryName].filter(
            (_category) => _category.control_has_automated_evidence_collected && _category.control_is_applicable
          ).length,
        });
      }
    }
    return groupedControls;
  }

  filterControlsByFramework(controls: CalculatedControl[], controlFramework: Framework): CalculatedControl[] {
    return controls.filter((control) => control.control_related_frameworks_names.hasOwnProperty(controlFramework.framework_name));
  }

  filterControlsInCategories(categories: Category[]): CategoryCollectedData[][] {
    return categories.map((category) => {
      const categoryWithOnlyApplicableControls = {
        ...category,
        values: category.values.filter((c) => c.control_is_applicable),
      };
      return this.getRelatedContentRows(categoryWithOnlyApplicableControls);
    });
  }

  joinProgressToCategory(categories: Category[], framework_id?: string): void {
    const categoryCollectedData = this.filterControlsInCategories(categories);
    categories.forEach((_category, index) => {
      if (framework_id) {
        _category['framework_id'] = framework_id;
      }
      categoryCollectedData.forEach((_collection, key) => {
        if (index === key) {
          _category['progress_status'] = _collection;
          // completed controls / total controls
          const totalControls = _category.values.filter((c) => c.control_is_applicable).length;
          const sumNecessaryControls = _category.values.filter((c) => c.control_is_applicable && (
            c.control_status.status === ControlStatusEnum.READY_FOR_AUDIT ||
            c.control_status.status === ControlStatusEnum.INPROGRESS ||
            c.control_status.status === ControlStatusEnum.APPROVED_BY_AUDITOR
          )).length;
          _category['status_indications'] = Number(getPercents(sumNecessaryControls, totalControls));
          _category['automation_indications'] = this.automatedPercentage(_category.control_automated, totalControls);
        }
      });
    });
  }

  automatedPercentage(automatedCount: number, totalControls: number): number {
    return Number(getPercents(automatedCount, totalControls));
  }

  getRelatedContentRows(category: Category): CategoryCollectedData[] {
    return [this.getNotStartedRow(category), this.getInProgressRow(category), this.getCompletedRow(category)];
  }

  private getCompletedRow(category: Category): CategoryCollectedData {
    return {
      icon: 'status_complete',
      value: category.values.filter((control) => control.control_status.status === ControlStatusEnum.COMPLIANT).length,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'contentRows.compliant',
      field: 'status',
      fieldValue: ControlStatusEnum.COMPLIANT,
      hideIconWrapper: true,
    };
  }

  private getInProgressRow(category: Category): CategoryCollectedData {
    return {
      icon: 'status_in_progress',
      value: category.values.filter((control) => control.control_status.status === ControlStatusEnum.INPROGRESS).length,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'contentRows.inProgress',
      field: 'status',
      fieldValue: ControlStatusEnum.INPROGRESS,
      hideIconWrapper: true,
    };
  }

  private getNotStartedRow(category: Category): CategoryCollectedData {
    return {
      icon: 'status_not_started',
      value: category.values.filter((control) => control.control_status.status === ControlStatusEnum.NOTSTARTED).length,
      valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
      descriptionTranslateKey: 'contentRows.notStarted',
      field: 'status',
      fieldValue: ControlStatusEnum.NOTSTARTED,
      hideIconWrapper: true,
    };
  }
}
