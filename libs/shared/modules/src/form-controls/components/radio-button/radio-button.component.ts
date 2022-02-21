import { Component, Injector, HostBinding, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';
import { MakeProvider } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [MakeProvider(RadioButtonComponent)],
})
export class RadioButtonComponent extends AbstractValueAccessor {
  @HostBinding('class.chosen')
  private get checked(): boolean {
    return this.value;
  }

  @HostBinding('class')
  private classes = 'items-center inline-flex';

  @Input()
  allowToggle: boolean;

  @HostBinding('class.pointer-events-none')
  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @Input()
  get value(): any {
    return super.value;
  }
  set value(v: any) {
    super.value = v;
  }

  @Output()
  toggled = new EventEmitter<boolean>();

  constructor(injector: Injector) {
    super(injector);
  }

  toggle(): void {
    this.value = !this.value;
    this.toggled.emit(this.value);
  }

  choose(): void {
    if (!this.value) {
      this.toggle();
    }
  }

  @HostListener('click')
  private click(): void {
    if (this.allowToggle) {
      this.toggle();
    } else {
      this.choose();
    }
  }
}
