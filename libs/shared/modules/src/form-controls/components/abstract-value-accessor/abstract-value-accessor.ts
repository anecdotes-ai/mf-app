import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Provider,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-abstract-value-accessor',
  template: '',
})
/* tslint:disable:component-class-suffix */
export class AbstractValueAccessor implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  private _isDisabled = false;
  private _value: any = null;
  private ngControl: NgControl;

  protected hostNativeElement: HTMLElement;
  protected get formControl(): AbstractControl {
    return this.ngControl?.control;
  }

  @Input()
  errorTexts: { [key: string]: string | (() => string) | TemplateRef<any> };
  @Input()
  required: boolean;

  @Input()
  index: number;

  @Input()
  validateOnDirty: boolean;

  isDisabled$ = new BehaviorSubject<boolean>(this.isDisabled);

  protected detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('class.dirty')
  get dirty(): boolean {
    return this.formControl?.dirty;
  }

  get fieldName(): string {
    return this.hostNativeElement.id;
  }

  @HostBinding('class.errors-displayed')
  get errorsDisplayed(): boolean {
    if (this.validateOnDirty) {
      return this.dirty && this.invalid;
    }

    return this.invalid;
  }

  @HostBinding('class.invalid')
  get invalid(): boolean {
    return this.formControl?.invalid;
  }

  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return !!this.value;
  }

  get value(): any {
    return this._value;
  }
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  @Input()
  set isDisabled(value: boolean) {
    if (this._isDisabled !== value) {
      if (value && this.formControl && this.formControl.enabled) {
        this.formControl.disable();
      } else if (!value && this.formControl && this.formControl.disabled) {
        this.formControl.enable();
      }

      this._isDisabled = value;
      this.isDisabled$.next(value);
    }
  }

  private _cd: ChangeDetectorRef;

  constructor(protected injector: Injector) {
    this._cd = injector.get(ChangeDetectorRef);
    this.hostNativeElement = injector.get<ElementRef<HTMLElement>>(ElementRef as any).nativeElement;
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get<NgControl>(NgControl, {} as any);
    this.formControl?.statusChanges.pipe(this.detacher.takeUntilDetach()).subscribe(() => this._cd.markForCheck());
  }

  markAsDirty(): void {
    if (!this.dirty) {
      if (this.formControl) {
        this.formControl.markAsDirty();
      }

      this.onTouch();
    }
  }

  writeValue(value: any): void {
    this._value = value;
  }

  onChange: (_) => void = () => { };

  onTouch: () => void = () => { };

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const reqAttrName = 'required';

    if (reqAttrName in simpleChanges) {
      if (simpleChanges.required.currentValue) {
        const attr = document.createAttribute(reqAttrName);
        this.hostNativeElement.attributes.setNamedItem(attr);
      } else {
        if (this.hostNativeElement.getAttribute(reqAttrName)) {
          this.hostNativeElement.attributes.removeNamedItem(reqAttrName);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}

export function MakeProvider(type: any): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true,
  };
}
