import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Injector, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [MakeProvider(TextAreaComponent)],
})
export class TextAreaComponent extends AbstractValueAccessor implements AfterViewChecked {
  @ViewChild('textfield', { static: true })
  textfieldElement: ElementRef<HTMLInputElement>;

  constructor(private cd: ChangeDetectorRef, injector: Injector, private elementRef: ElementRef<HTMLElement>) {
    super(injector);
  }

  @HostBinding('class.dirty')
  get dirty(): boolean {
    return this.formControl?.dirty;
  }

  @HostBinding('class.invalid')
  get invalid(): boolean {
    return this.formControl?.invalid;
  }

  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return this.value;
  }

  @HostBinding('class.active')
  isActive: boolean;

  @Input()
  maxLength: number;

  @Input()
  errorTexts: { [key: string]: string | (() => string) };

  @Input()
  label: string;

  @Input()
  labelParamsObj: any;

  @Input()
  required: boolean;

  @Input()
  placeholder: string | TemplateRef<any>;

  @Input()
  placeholderParamsObj: any;

  @Input()
  placeholderIcon: string;

  @Input()
  displayCharactersCounter: boolean;

  @Input()
  validateOnDirty = false;

  @Input()
  index: number;

  @Input()
  removable: boolean;

  @Input()
  readonly: boolean;

  @Input()
  rows: number;

  @Input()
  resizable = true;

  @HostBinding('attr.tabIndex')
  @Input()
  tabIndex = '-1';

  @Input()
  autogrow: boolean;

  @Input()
  displayErrors: boolean;

  @Output()
  input = new EventEmitter<InputEvent | Event>();

  @Output()
  valueChanges = new EventEmitter<string>();

  @Output()
  removeControl: EventEmitter<string> = new EventEmitter();

  @Output()
  focusOut = new EventEmitter();

  ngAfterViewChecked(): void {
    this.handleAutoGrow();
  }

  focus(): void {
    this.textfieldElement.nativeElement.focus();
  }

  placeholderClick(): void {
    if (!this.isDisabled) {
      this.textfieldElement.nativeElement.focus();
    }
  }

  inputBlur(): void {
    this.markAsDirty();
  }

  inputFocusIn(): void {
    this.isActive = true;
    this.elementRef.nativeElement.dispatchEvent(new FocusEvent('focusin'));
    this.cd.detectChanges();
  }

  inputFocusOut(): void {
    if (this.textfieldElement.nativeElement.value) {
      this.textfieldElement.nativeElement.value = this.textfieldElement.nativeElement.value.trim();
    }

    this.isActive = false;
    this.elementRef.nativeElement.dispatchEvent(new FocusEvent('focusout'));
    this.focusOut.emit();
    this.cd.detectChanges();
  }

  valueChangesEventEmitHandler(changes: any): void {
    if (typeof changes === 'string') {
      this.valueChanges.next(changes);
    }
  }

  private handleAutoGrow(): void {
    if(this.autogrow) {
      this.textfieldElement.nativeElement.style.height = "5px";
      this.textfieldElement.nativeElement.style.height = (this.textfieldElement.nativeElement.scrollHeight) + "px";
    }
  }
}
