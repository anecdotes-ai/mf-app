import { ThreadStateEnum } from '@anecdotes/commenting';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { CommentingFacadeService, CommentPanelManagerService, ConfirmationModalService } from '../../services';

@Component({
  selector: 'app-delete-all-action',
  templateUrl: './delete-all-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAllActionComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  resolvedCommentsExist: boolean;

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
        this.resolvedCommentsExist = !threadViewModels.some((r) => r.threadState === ThreadStateEnum.Resolved);
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async resolveAll(): Promise<void> {
    if (await this.confirmationModalService.openDeleteAllConfirmation()) {
      await this.commentingFacadeService.deleteAllResolvedThreads();
    }
  }
}
