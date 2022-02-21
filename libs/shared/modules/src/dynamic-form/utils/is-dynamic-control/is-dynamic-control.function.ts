import { AbstractDynamicControl } from '../../models';

export function isDynamicControl(obj: any): boolean {
  return obj instanceof AbstractDynamicControl;
}
