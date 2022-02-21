import { CommentInputValue, CommentModel, ThreadModel } from '@anecdotes/commenting';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { Observable } from 'rxjs';
import { CommentEntityNameEnum, ThreadViewModel } from '../../models';
import { CommentingFacadeService, CommentPanelManagerService, ConfirmationModalService } from '../../services';
import { createComposedResourceId } from '../../utils';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { SubscriptionDetacher } from 'core/utils';
import { UserClaims } from 'core/modules/auth-core/models';

@Component({
  selector: 'app-active-thread',
  templateUrl: './active-thread.component.html',
})
export class ActiveThreadComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private currentUser: UserClaims;
  private currentUserRole: RoleEnum;
  
  @Input()
  resource: ThreadViewModel;

  thread$: Observable<ThreadModel>;
  comments$: Observable<CommentModel[]>;
  isFocused$: Observable<boolean>;

  constructor(
    private commentingFacadeService: CommentingFacadeService,
    private commentPanelManagerService: CommentPanelManagerService,
    private confirmationService: ConfirmationModalService,
    private focusingService: FocusingService,
    private roleService: RoleService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.thread$ = this.commentingFacadeService.getThreadById(this.resource.threadId);
    this.comments$ = this.commentingFacadeService.getCommentsByThreadId(this.resource.threadId);
    this.isFocused$ = this.commentPanelManagerService.isResourceFocused(
      this.resource.resourceType,
      this.resource.resourceId
    );

    this.authService.getUser().pipe(this.detacher.takeUntilDetach()).subscribe((user) => this.currentUser = user);
    this.roleService.getCurrentUserRole().pipe(this.detacher.takeUntilDetach()).subscribe((roleObj) => this.currentUserRole = roleObj.role as RoleEnum);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  resolveThread(): void {
    this.commentingFacadeService.resolveThreadAsync(this.resource.threadId);
  }

  editThread(threadId: string, commentInputValue: CommentInputValue): void {
    this.commentingFacadeService.editThreadAsync(threadId, commentInputValue);
  }

  editComment(commentId: string, commentInputValue: CommentInputValue): void {
    this.commentingFacadeService.editCommentAsync(commentId, commentInputValue);
  }

  shouldMenuBeDisplayed(userId: string): boolean {
    return userId === this.currentUser.user_id || this.currentUserRole === RoleEnum.Admin;
  }

  async deleteComment(commentId: string): Promise<void> {
    if (await this.confirmationService.openReplyDeleteConfirmation()) {
      this.commentingFacadeService.deleteComment(commentId);
    }
  }

  async deleteThread(): Promise<void> {
    if (await this.confirmationService.openThreadDeleteConfirmation()) {
      this.commentingFacadeService.deleteThread(this.resource.threadId);
    }
  }

  @HostListener('click', ['$event'])
  private focusResource(): void {
    this.focusingService.focusSingleResource(
      CommentEntityNameEnum.Resource,
      createComposedResourceId(this.resource.resourceType, this.resource.resourceId)
    );
    this.commentPanelManagerService.focusComment(this.resource.resourceType, this.resource.resourceId);
  }
}
