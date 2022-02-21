import { CategoryHeader } from './category-header.modal';
export interface VScrollListEntity<T> {
  entityOrHeader: CategoryHeader | T;
  isEntity: boolean;
  headerContext?: object;
}
