import { ThreadStateEnum } from '@anecdotes/commenting';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommentPanelManagerService } from '../../services';

@Component({
  selector: 'app-no-comments-empty-state',
  templateUrl: './no-comments-empty-state.component.html',
})
export class NoCommentsEmptyStateComponent implements OnInit {
  @HostBinding('class')
  private classes = 'flex flex-col gap-3 items-center font-main text-navy-70 text-center px-11 py-8';

  emptyStateTranslationObj$: Observable<{ key: string; icon: string }>;

  constructor(private commentPanelManagerService: CommentPanelManagerService) {}

  ngOnInit(): void {
    this.emptyStateTranslationObj$ = this.commentPanelManagerService.getStateThreadsDisplayedBy().pipe(
      map((currentState) => {
        if (currentState === ThreadStateEnum.Active) {
          return { key: 'activeEmptyState', icon: 'commenting/add-comment' };
        } else if (currentState === ThreadStateEnum.Resolved) {
          return { key: 'resolvedEmptyState', icon: 'commenting/checkmark' };
        }
      })
    );
  }

  buildTranslationKey(emptyStateTranslation: string, relativeKey: string): string {
    return `commenting.noCommentsEmptyState.${emptyStateTranslation}.${relativeKey}`;
  }
}
