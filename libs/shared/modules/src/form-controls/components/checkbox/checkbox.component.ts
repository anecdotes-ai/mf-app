import { ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Injector, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractValueAccessor } from '../abstract-value-accessor';

export const BasicVariant = 'basic';
export const MultiselectVariant = 'multiselect';

const CheckboxIcons = {
  [BasicVariant]: 'checkbox',
  [MultiselectVariant]: 'multiselect-checkbox',
};

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true }],
})
export class CheckboxComponent extends AbstractValueAccessor {
  readonly checkboxIcons = CheckboxIcons;

  @HostBinding('class.checked')
  private get checked(): boolean {
    return this.value as boolean;
  }

  errorTexts: { [key: string]: string | (() => string) };
  @Input()
  required: boolean;

  @Input()
  label: string;

  @Input()
  valueLabel: string;

  @HostBinding('class')
  @Input()
  checkBoxVariant: typeof BasicVariant | typeof MultiselectVariant = BasicVariant;

  @Input()
  index: number;

  validateOnDirty: any;

  @Output()
  changeValue = new EventEmitter<{ checked: boolean }>();

  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
  }

  writeValue(value): void {
    super.writeValue(value);
    this.changeValue.emit({ checked: this.value });
    this.cd.markForCheck();
  }

  toggle(): void {
    this.value = !this.value;
    this.changeValue.emit({ checked: this.value });
  }
}
