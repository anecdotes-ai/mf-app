import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { MenuAction } from 'core/modules/dropdown-menu';
import { delayedPromise, SubscriptionDetacher } from 'core/utils';
import { delay, filter } from 'rxjs/operators';
import { CommentPanelManagerService } from '../../services';
import { CommentInputValue } from '@anecdotes/commenting';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { CommentEntityNameEnum } from '../../models';
import { ShortDate } from 'core/constants/date';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentViewComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  @HostBinding('class')
  private classes = 'flex flex-row gap-3 p-3';
  private _body: string;

  @ViewChild('input', { static: true })
  private input: CommentInputComponent;

  @Input()
  date: string;

  get body(): string {
    return this._body;
  }

  @Input()
  set body(value: string) {
    this.textControl.setValue({ body: value } as CommentInputValue);
    this._body = value;
  }

  @Input()
  userId: string;

  @Input()
  commentId: string;

  @Input()
  commentType: 'thread' | 'comment';

  @Input()
  fallbackUserName: string;

  @Input()
  displayMenu;

  @Output()
  delete = new EventEmitter();

  @Output()
  edit = new EventEmitter<CommentInputValue>();

  textControl: FormControl = new FormControl(null, Validators.required);
  isEditable: boolean;
  isInputFocused: boolean;
  shortDate = ShortDate;

  menuActions: MenuAction[] = [
    {
      translationKey: 'commenting.options.edit',
      action: () => this.editMessage(),
    },
    {
      translationKey: 'commenting.options.delete',
      action: () => this.deleteMessage(),
    },
  ];

  constructor(
    private commentPanelManagerService: CommentPanelManagerService,
    private cd: ChangeDetectorRef,
    private focusingService: FocusingService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.textControl.statusChanges.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.cd.detectChanges());

    this.commentPanelManagerService
      .getEditingThreadId()
      .pipe(
        filter(() => this.commentType === 'thread'),
        this.detacher.takeUntilDetach()
      )
      .subscribe((threadId) => {
        if (threadId === this.commentId) {
          this.enableEditMode();
        } else {
          this.disableEditMode();
        }
      });

    this.commentPanelManagerService
      .getEditingCommentId()
      .pipe(
        filter(() => this.commentType === 'comment'),
        this.detacher.takeUntilDetach()
      )
      .subscribe((commentId) => {
        if (commentId === this.commentId) {
          this.enableEditMode();
        } else {
          this.disableEditMode();
        }
      });

    if (this.commentType === 'comment') {
      this.focusingService
        .getFocusingStreamByResourceId(CommentEntityNameEnum.Comment, this.commentId)
        .pipe(delay(500), this.detacher.takeUntilDetach())
        .subscribe(() => {
          this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  confirmEdit(): void {
    this.edit.emit(this.textControl.value as CommentInputValue);
    this.commentPanelManagerService.closeEditing();
  }

  cancelEdit(): void {
    this.commentPanelManagerService.closeEditing();
  }

  buildTranslationKey(relativeKey: string): string {
    return `commenting.${relativeKey}`;
  }

  inputGotFocus(): void {
    this.isInputFocused = true;
    this.cd.detectChanges();
  }

  private async enableEditMode(): Promise<void> {
    this.isEditable = true;
    this.cd.detectChanges();
    await delayedPromise(100);
    this.input.focus();
  }

  private disableEditMode(): void {
    this.isEditable = false;
    this.isInputFocused = false;
    this.textControl.setValue({ body: this.body } as CommentInputValue);
    this.cd.detectChanges();
  }

  private editMessage(): void {
    if (this.commentType === 'thread') {
      this.commentPanelManagerService.editThread(this.commentId);
    } else if (this.commentType === 'comment') {
      this.commentPanelManagerService.editComment(this.commentId);
    }
  }

  private deleteMessage(): void {
    this.delete.emit();
  }
}
