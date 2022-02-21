import { Category } from './../../../../dashboard/models/category';
import { SlideCategoryInfo } from './../models/information-security-slide-content.model';
import { Component, Input, OnInit } from '@angular/core';
import { CategoriesByFramework, InformationSecuritySlideContent } from '../models';

@Component({
  selector: 'app-information-security-slide-content',
  templateUrl: './information-security-slide-content.component.html',
  styleUrls: ['./information-security-slide-content.component.scss'],
})
export class InfoSecSlideContentComponent implements OnInit {
  @Input()
  data: InformationSecuritySlideContent;

  subCategoriesInfo: Category[];

  ngOnInit(): void {
    this.subCategoriesInfo = this.data?.allCategories.sort((a, b) =>
      a.category_name.localeCompare(b.category_name, undefined, { numeric: true })
    );
  }

  public getFrameworkCategoryControlsCollectedProgress(
    frameworkCategory: CategoriesByFramework,
    categoryInfo: SlideCategoryInfo
  ): { value: string; colorClass: string } {
    const foundCurrentCategory = frameworkCategory.categories.find(
      (category) => category.category_name === categoryInfo.category_name
    );

    if (!foundCurrentCategory && !foundCurrentCategory?.status_indications) {
      return {
        value: '0',
        colorClass: this.getColorClassByCategoryProgress(0),
      };
    }

    return {
      value: foundCurrentCategory.status_indications.toString(),
      colorClass: this.getColorClassByCategoryProgress(foundCurrentCategory.status_indications),
    };
  }

  getColorClassByCategoryProgress(progress: number): string {
    switch (true) {
      case progress < 51:
        return 'bg-pink';
      case progress < 81:
        return 'bg-orange';
      default:
        return 'bg-blue';
    }
  }
}
