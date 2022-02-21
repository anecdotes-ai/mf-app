import { ThreadStateEnum } from '@anecdotes/commenting';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommentPanelManagerService } from '../../services';
import { SubscriptionDetacher } from 'core/utils';

interface Option {
  value: ThreadStateEnum;
  displayValue: string;
}

export const activeOption: Option = {
  value: ThreadStateEnum.Active,
  displayValue: 'commenting.options.active',
};

export const resolvedOption: Option = {
  value: ThreadStateEnum.Resolved,
  displayValue: 'commenting.options.resolved',
};

@Component({
  selector: 'app-thread-state-filter',
  templateUrl: './thread-state-filter.component.html',
})
export class ThreadStateFilterComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes = 'flex flex-row gap-3 items-center';

  constructor(
    private translateService: TranslateService,
    private commentPanelManagerService: CommentPanelManagerService
  ) {}

  filterOptions: Option[] = [activeOption, resolvedOption];
  displayValueSelector = this.selectDisplayValue.bind(this);
  control = new FormControl();

  ngOnInit(): void {
    this.commentPanelManagerService
      .getStateThreadsDisplayedBy()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((state) => {
        let option: Option;

        switch (state) {
          case ThreadStateEnum.Active: {
            option = activeOption;
            break;
          }
          default:
            option = resolvedOption;
        }

        this.control.setValue(option, { emitEvent: false });
      });

    this.control.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((option: Option) => {
      this.selectOption(option);
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private selectOption(opt: Option): void {
    if (opt.value === ThreadStateEnum.Active) {
      this.commentPanelManagerService.displayActiveThreads();
    } else {
      this.commentPanelManagerService.displayResolvedThreads();
    }
  }

  private selectDisplayValue(opt: Option): string {
    return this.translateService.instant(opt.displayValue);
  }
}
