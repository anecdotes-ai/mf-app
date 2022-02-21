import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { delayedPromise } from 'core/utils';

@Component({
  selector: 'app-risk-editable-field',
  templateUrl: './risk-editable-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskEditableFieldComponent {
  private _text: string;

  @ViewChild('textarea')
  private textareaComponent: ElementRef<HTMLTextAreaElement>;

  @HostBinding('class')
  private classes = 'flex flex-col font-main w-full overflow-visible';

  @Input()
  rowsCount = 3;

  @Input()
  isSearchable = false;

  get fieldText(): string {
    return this._text;
  }
  @Input()
  set fieldText(v: string) {
    this._text = v;
    this.textSetCallback();
  }

  textToDisplay: string;

  @Input()
  placeholder: string;

  @Input()
  fieldName: string;

  @Input()
  submitOnEnter: boolean;

  @Input()
  isRequired: boolean;

  @Output()
  submit = new EventEmitter<string>();

  formControl: FormControl;

  get hasChanges(): boolean {
    if (this.fieldText) {
      return this.formControl?.value !== this.fieldText;
    }

    return !!this.formControl?.value;
  }

  constructor(private cd: ChangeDetectorRef, protected hostElementRef: ElementRef<HTMLElement>) {}

  async enableEditableMode(): Promise<void> {
    this.formControl = new FormControl(this.textToDisplay, this.isRequired ? Validators.required : null);
    this.cd.detectChanges();
    await delayedPromise(100);
    this.textareaComponent.nativeElement.focus();
  }

  submitEditing(event: Event): void {
    if (!this.submitOnEnter && (event as KeyboardEvent)?.key === 'Enter') {
      return;
    }

    event.preventDefault();
    this.textToDisplay = this.formControl.value;
    this.submit.emit(this.formControl.value);
    this.cancelEditing();
  }

  preventNewLine(event: Event): void {
    if (this.submitOnEnter) {
      event.preventDefault();
    }
  }

  cancelEditing(): void {
    this.formControl = null;
    this.cd.detectChanges();
  }

  isBlockWithTextOverflown(blockWithText: HTMLElement): boolean {
    return blockWithText.scrollHeight > blockWithText.offsetHeight;
  }

  private textSetCallback(): void {
    this.textToDisplay = this._text;
    setTimeout(() => this.cd.detectChanges(), 500); // TODO
  }

  @HostListener('window:mousedown', ['$event'])
  private windowClick(mouseEvent: MouseEvent): void {
    // Handles outside clicks to cancel editing when there are no changes
    if (
      this.formControl &&
      !this.hasChanges &&
      !mouseEvent.composedPath().some((x) => x === this.hostElementRef.nativeElement)
    ) {
      this.cancelEditing();
    }
  }
}
