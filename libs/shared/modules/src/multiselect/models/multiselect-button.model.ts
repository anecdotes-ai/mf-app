export interface MultiselectButtonDefinition {
  action: (selectedItems: Map<string, any>) => void | Promise<void>;
  translationKey: string;
  cssClass: string;
}
