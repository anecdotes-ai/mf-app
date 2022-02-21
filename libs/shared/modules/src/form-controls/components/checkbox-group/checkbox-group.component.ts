import { Component, Injector, Input } from '@angular/core';
import { CheckBoxGroupItem } from 'core/models';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent extends AbstractValueAccessor {
  @Input()
  errorTexts: { [key: string]: string | (() => string) };

  @Input()
  required: boolean;

  @Input()
  label = 'checkBoxGroupLabel';

  @Input()
  index: number;

  @Input()
  validateOnDirty: boolean;

  @Input()
  checkboxes: CheckBoxGroupItem[];

  constructor(injector: Injector) {
    super(injector);
  }

  groupValueChange(value: { checked: boolean }, item: CheckBoxGroupItem): void {
    item.value = value.checked;
    const newValue = {...this.value};

    item.value ? newValue[item.fieldName] = item.value : delete newValue[item.fieldName];

    this.value = Object.keys(newValue).length ? newValue : undefined;
  }

  buildTranslationKey(relativeKey: string): string {
    return `openedPlugin.dynamicForm.${relativeKey}`;
  }
}
