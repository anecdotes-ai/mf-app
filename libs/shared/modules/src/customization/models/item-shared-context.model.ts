import { StatusModalWindowSharedContext } from 'core/modules/modals';
import { CustomItemModel } from './';

export interface ItemSharedContext extends StatusModalWindowSharedContext {
  item?: CustomItemModel;
  poolOfItems?: any[];
  poolValueSelector?: (c: any) => string;
  submitAction: (item: CustomItemModel) => Promise<any>;
}
