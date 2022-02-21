import { Component, HostBinding, OnInit } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { CommentPanelManagerService } from '../../services';

@Component({
  selector: 'app-commenting-pannel-button',
  templateUrl: './commenting-pannel-button.component.html',
})
export class CommentingPannelButtonComponent implements OnInit {
  private detacher = new SubscriptionDetacher();

  isOpen$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  overallCommentsCount$: Observable<number>;

  @HostBinding('class.hidden')
  private isHidden: boolean;

  constructor(private commentPanelManagerService: CommentPanelManagerService) {}

  ngOnInit(): void {
    this.isOpen$ = this.commentPanelManagerService.isOpen();
    this.overallCommentsCount$ = this.commentPanelManagerService.getCommentsCount();
    this.isLoading$ = this.overallCommentsCount$.pipe(mapTo(false), startWith(true));

    this.isOpen$.pipe(this.detacher.takeUntilDetach()).subscribe((isOpen) => (this.isHidden = isOpen));
  }

  open(): void {
    this.commentPanelManagerService.open();
  }
}
