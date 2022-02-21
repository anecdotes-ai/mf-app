import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserClaims } from 'core/modules/auth-core/models';
import { AuthService } from 'core/modules/auth-core/services';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommentingFacadeService, CommentPanelManagerService } from '../../services';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { CommentInputValue } from '@anecdotes/commenting';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
})
export class ReplyComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @ViewChild('input', { static: true })
  private input: CommentInputComponent;

  @HostBinding('class')
  private classes = 'flex flex-row gap-3 border-solid border-t border-navy-30 py-4 px-3';

  @Input()
  threadId: string;

  creation$ = new BehaviorSubject<boolean>(false);
  textControl = new FormControl(null, Validators.required);
  isFocused$: Observable<boolean>;
  currentUser$: Observable<UserClaims>;

  constructor(
    private commentingFacadeService: CommentingFacadeService,
    private commentPanelManagerService: CommentPanelManagerService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isFocused$ = this.commentPanelManagerService
      .getReplyingThreadId()
      .pipe(map((threadId) => this.threadId === threadId));
    this.currentUser$ = this.authService.getUser();
    this.textControl.statusChanges.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.cd.detectChanges());
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async reply(): Promise<void> {
    try {
      this.creation$.next(true);
      await this.commentingFacadeService.createCommentAsync(this.threadId, this.textControl.value as CommentInputValue);
      this.input.reset();
      this.commentPanelManagerService.closeReplying();
    } catch {
    } finally {
      this.creation$.next(false);
    }
  }

  cancel(): void {
    this.commentPanelManagerService.closeReplying();
    this.input.reset();
  }

  inputGotFocus(): void {
    this.commentPanelManagerService.replyToThread(this.threadId);
  }

  inputLostFocus(): void {
    // TODO
  }

  buildTranslationKey(relativeKey: string): string {
    return `commenting.${relativeKey}`;
  }
}
