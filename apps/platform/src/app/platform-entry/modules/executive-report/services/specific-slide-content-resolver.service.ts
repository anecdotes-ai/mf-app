import { FrameworkService } from 'core/modules/data/services';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { Injectable } from '@angular/core';
import { FrameworksStatusSlideContentComponent } from '../components/specific-slides/frameworks-status-slide-content/frameworks-status-slide-content.component';
import { InfoSecSlideContentComponent } from '../components/specific-slides/information-security-slide-content/information-security-slide-content.component';
import {
  CategoriesByFramework,
  FrameworksStatusSlideContentData,
  InformationSecuritySlideContent,
  SpecificSlideContent,
} from '../models';
import { DashboardCategoriesResolverService } from '../../dashboard/services';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class SpecificSlideContentResolverService {
  constructor(
    private categoriesResolver: DashboardCategoriesResolverService,
    private frameworkService: FrameworkService
  ) {}

  public getAllSlidesContent(frameworks: Framework[], controls: CalculatedControl[]): SpecificSlideContent[] {
    return [
      this.getFrameworksStatusSlideContent(frameworks),
      this.getInformationSecuritySlideContent(controls, frameworks),
    ];
  }

  private getFrameworksStatusSlideContent(frameworks: Framework[]): SpecificSlideContent {
    const data: FrameworksStatusSlideContentData = {
      frameworks,
    };

    return {
      slideTitleTranslationKey: 'frameworksStatus.title',
      inputData: data,
      slideComponentType: FrameworksStatusSlideContentComponent,
    };
  }

  private getInformationSecuritySlideContent(
    controls: CalculatedControl[],
    frameworks: Framework[]
  ): SpecificSlideContent {
    const allCategories = this.categoriesResolver.groupInCategories(controls, true).map((category) => ({
      category_name: category.category_name,
      icon: this.categoriesResolver.getCategoryIcon(category.category_name),
    }));

    const filteredControlsByFrameworks = frameworks.map((framework) => ({
      framework,
      relatedControls: controls.filter((control) =>
        control.control_related_frameworks.includes(framework.framework_id)
      ),
    }));

    const mappedCategoriesByFrameworks = filteredControlsByFrameworks.map<CategoriesByFramework>(
      (controlsByFrameworks) => {
        const categories = this.categoriesResolver.groupInCategories(controlsByFrameworks.relatedControls);
        this.categoriesResolver.joinProgressToCategory(categories, controlsByFrameworks.framework.framework_id);

        return {
          framework: controlsByFrameworks.framework,
          framework_icon: this.frameworkService.getFrameworkIconLink(controlsByFrameworks.framework.framework_id, true),
          categories: categories,
        };
      }
    );

    const data: InformationSecuritySlideContent = {
      allCategories,
      frameworksCategories: mappedCategoriesByFrameworks,
    };

    return {
      slideTitleTranslationKey: 'informationSecurityByCategories.title',
      inputData: data,
      slideComponentType: InfoSecSlideContentComponent,
    };
  }
}
