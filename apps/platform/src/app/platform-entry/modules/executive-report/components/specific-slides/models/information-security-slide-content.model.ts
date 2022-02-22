import { Framework } from 'core/modules/data/models/domain';
import { Category } from '../../../../dashboard/models/category';

export interface InformationSecuritySlideContent {
  allCategories: SlideCategoryInfo[];
  frameworksCategories: CategoriesByFramework[];
}

export interface SlideCategoryInfo {
  category_name: string;
  icon: string;
}

export interface CategoriesByFramework {
  framework: Framework;
  framework_icon: string;
  categories: Category[];
}
