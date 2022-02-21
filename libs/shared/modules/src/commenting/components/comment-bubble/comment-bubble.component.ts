import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { SubscriptionDetacher } from 'core/utils';
import { CommentEntityNameEnum, ThreadViewModel } from '../../models';
import { CommentPanelManagerService, CommentingUserEventsService } from '../../services';

@Component({
  selector: 'app-comment-bubble',
  templateUrl: './comment-bubble.component.html',
  styleUrls: ['./comment-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentBubbleComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private allThreadViewModels: ThreadViewModel[];

  @HostBinding('class')
  private classes = 'font-main font-bold text-base cursor-pointer';

  @HostBinding('class.hidden')
  private isNotReady = true;

  @Input()
  resourceId: string;

  @Input()
  resourceType: string;

  @HostBinding('class.focused')
  isFocused: boolean;

  commentsAndRepliesCount: number;

  @HostBinding('class.threads-exist')
  get commentsAndRepliesExist(): boolean {
    return !!this.commentsAndRepliesCount;
  }

  constructor(
    private commentPanelManagerService: CommentPanelManagerService,
    private commentingUserEventsService: CommentingUserEventsService,
    private elementRef: ElementRef<HTMLElement>,
    private currentCd: ChangeDetectorRef,
    private focusingService: FocusingService,
    // See more here: https://github.com/angular/angular/issues/22560
    @SkipSelf() private parentCd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // see SCSS file for the explanation
    this.elementRef.nativeElement.parentElement.classList.add('panel-trigger-parent');
    const threadsAndRepliesCountForResource$ = this.commentPanelManagerService.getThreadsAndRepliesCountForResource(
      this.resourceType,
      this.resourceId
    );

    threadsAndRepliesCountForResource$.pipe(this.detacher.takeUntilDetach()).subscribe((count) => {
      this.commentsAndRepliesCount = count;
      delete this.isNotReady;
      this.detectChanges();
    });

    this.commentPanelManagerService
      .isResourceFocused(this.resourceType, this.resourceId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((isFocused) => {
        this.isFocused = isFocused;
        this.detectChanges();
      });

    this.commentPanelManagerService
      .getCommentingResources()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((allResources) => (this.allThreadViewModels = allResources));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  @HostListener('click')
  private onClick(): void {
    if (this.commentsAndRepliesExist) {
      const threadViewModel = this.allThreadViewModels.find(
        (r) => r.resourceType === this.resourceType && r.resourceId === this.resourceId
      );
      this.focusingService.focusSingleResource(CommentEntityNameEnum.Thread, threadViewModel.threadId);
      this.commentPanelManagerService.focusComment(this.resourceType, this.resourceId);
      this.commentingUserEventsService.trackFocusThreadEventAsync(this.resourceType, this.resourceId, this.commentsAndRepliesCount);
    } else {
      this.commentPanelManagerService.createThread(this.resourceType, this.resourceId);
    }
  }

  private detectChanges(): void {
    // For some reason, when we call the components change detection
    // it doesn't take into account hostbindings and some classes get lost from the host element
    // but if we use call parentCd.detectChanges it doesn't detect changes in the component and the template doesn't render as we need
    // as a workaround we end up with calling both ChangeDetectorRef's
    this.currentCd.detectChanges(); // Updates the component's template
    this.parentCd.detectChanges(); // Updates host bindings. See more here: https://github.com/angular/angular/issues/22560
  }
}
