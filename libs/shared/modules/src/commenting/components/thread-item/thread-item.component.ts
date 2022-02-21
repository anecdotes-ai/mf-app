import { ThreadModel, ThreadStateEnum } from '@anecdotes/commenting';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ThreadViewModel } from '../../models';
import { SubscriptionDetacher } from 'core/utils';
import { filter } from 'rxjs/operators';
import { CommentingFacadeService } from '../../services';

@Component({
  selector: 'app-thread-item',
  templateUrl: './thread-item.component.html',
  styleUrls: ['./thread-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadItemComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'block rounded-md border border-solid border-navy-40 overflow-hidden bg-white';

  @Input()
  resource: ThreadViewModel;

  thread$: Observable<ThreadModel>;

  get isThreadCreation(): boolean {
    return this.resource.isCreation;
  }

  isActiveThread: boolean;

  isResolvedThread: boolean;

  constructor(private commentingFacadeService: CommentingFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.resource.isCreation) {
      this.commentingFacadeService
        .getThreadById(this.resource.threadId)
        .pipe(
          filter((t) => !!t),
          this.detacher.takeUntilDetach()
        )
        .subscribe((thread) => {
          this.isActiveThread = thread.state === ThreadStateEnum.Active;
          this.isResolvedThread = thread.state === ThreadStateEnum.Resolved;
          this.cd.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
