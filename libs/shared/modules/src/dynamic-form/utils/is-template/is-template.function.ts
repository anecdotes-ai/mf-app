import { TemplateModel } from '../../models';

export function isTemplateModel(obj: any): boolean {
  return obj instanceof TemplateModel;
}
