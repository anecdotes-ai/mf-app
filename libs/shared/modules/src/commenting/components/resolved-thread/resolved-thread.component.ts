import { CommentModel, ThreadModel } from '@anecdotes/commenting';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserClaims } from 'core/modules/auth-core/models';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { ThreadViewModel } from '../../models';
import { CommentingFacadeService, ConfirmationModalService } from '../../services';

@Component({
  selector: 'app-resolved-thread',
  templateUrl: './resolved-thread.component.html',
  styleUrls: ['./resolved-thread.component.scss'],
})
export class ResolvedThreadComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private currentUser: UserClaims;
  private currentUserRole: RoleEnum;
  
  @Input()
  resource: ThreadViewModel;

  thread$: Observable<ThreadModel>;
  comments$: Observable<CommentModel[]>;

  menuActions: MenuAction[] = [
    {
      translationKey: 'commenting.options.setActive',
      action: () => this.setActive(),
    },
    {
      translationKey: 'commenting.options.delete',
      action: () => this.deleteThread(),
    },
  ];

  constructor(
    private commentingFacade: CommentingFacadeService,
    private modalWindowService: ConfirmationModalService,
    private roleService: RoleService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.thread$ = this.commentingFacade.getThreadById(this.resource.threadId);
    this.comments$ = this.commentingFacade.getCommentsByThreadId(this.resource.threadId);
    
    this.authService.getUser().pipe(this.detacher.takeUntilDetach()).subscribe((user) => this.currentUser = user);
    this.roleService.getCurrentUserRole().pipe(this.detacher.takeUntilDetach()).subscribe((roleObj) => this.currentUserRole = roleObj.role as RoleEnum);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  shouldMenuBeDisplayed(userId: string): boolean {
    return userId === this.currentUser.user_id || this.currentUserRole === RoleEnum.Admin;
  }

  private setActive(): void {
    this.commentingFacade.activateThreadAsync(this.resource.threadId);
  }

  private async deleteThread(): Promise<void> {
    if (await this.modalWindowService.openThreadDeleteConfirmation()) {
      this.commentingFacade.deleteThread(this.resource.threadId);
    }
  }
}
