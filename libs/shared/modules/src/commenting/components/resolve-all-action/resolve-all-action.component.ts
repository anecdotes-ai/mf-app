import { ThreadStateEnum } from '@anecdotes/commenting';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { CommentingFacadeService, CommentPanelManagerService, ConfirmationModalService } from '../../services';

@Component({
  selector: 'app-resolve-all-action',
  templateUrl: './resolve-all-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResolveAllActionComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  activeCommentsExist: boolean;

  constructor(
    private commentingFacadeService: CommentingFacadeService,
    private commentPanelManagerService: CommentPanelManagerService,
    private confirmationModalService: ConfirmationModalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.commentPanelManagerService
      .getCommentingResources()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((threadViewModels) => {
        this.activeCommentsExist = !threadViewModels.some((r) => r.threadState === ThreadStateEnum.Active);
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async resolveAll(): Promise<void> {
    if (await this.confirmationModalService.openResolveAllConfirmation()) {
      await this.commentingFacadeService.resolveAllActiveThreads();
    }
  }
}
