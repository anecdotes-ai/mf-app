import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { SubscriptionDetacher } from 'core/utils';
import { AnecdotesCommentInputComponent } from '@anecdotes/commenting';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommentInputComponent),
      multi: true,
    },
  ],
})
export class CommentInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private detacher = new SubscriptionDetacher();
  @ViewChild('textInput', { static: true })
  private textInput: AnecdotesCommentInputComponent;
  isInFocus: boolean;

  textControl = new FormControl(null, Validators.required);

  @HostBinding('class.editable')
  @Input()
  editable = true;

  @Input()
  placeholder: string;

  @Output()
  gotFocus = new EventEmitter();

  @Output()
  lostFocus = new EventEmitter();

  /** If true the input gets focus on initialization */
  @Input()
  focusOnInit: boolean;

  onChange: (v) => void = () => {};
  onTouch: (v) => void = () => {};

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.textControl.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((v) => this.onChange(v));

    if (this.focusOnInit) {
      setTimeout(() => {
        this.focus();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  reset(): void {
    this.textControl.reset();
  }

  focus(): void {
    this.textInput.focus();
  }

  writeValue(obj: any): void {
    this.textControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.textControl.disable();
    } else {
      this.textControl.enable();
    }
  }

  focusIn(): void {
    this.gotFocus.emit();
    this.isInFocus = true;
    this.cd.detectChanges();
  }

  focusOut(): void {
    this.lostFocus.emit();
    this.isInFocus = false;
    this.cd.detectChanges();
  }
}
