import { FrameworkStatus } from '../models';
import { Framework } from 'core/modules/data/models/domain';

export const NewFramework: Framework = {
  framework_id: '0',
  framework_name: 'Create Your Own',
  is_applicable: false,
  framework_status: FrameworkStatus.NEW
};
