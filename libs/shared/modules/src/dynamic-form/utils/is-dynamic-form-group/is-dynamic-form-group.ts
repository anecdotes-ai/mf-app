import { DynamicFormGroup } from '../../models';

export function isDynamicFormGroup(obj: any): boolean {
  return obj instanceof DynamicFormGroup;
}
