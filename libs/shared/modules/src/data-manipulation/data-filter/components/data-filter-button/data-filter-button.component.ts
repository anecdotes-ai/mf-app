import { Component, HostBinding, OnInit } from '@angular/core';
import { DataFilterManagerService } from '../../services';
import { Observable } from 'rxjs';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-data-filter-button',
  templateUrl: './data-filter-button.component.html'
})
export class DataFilterButtonComponent implements OnInit {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class.hidden')
  private isHidden: boolean;

  isOpen$: Observable<boolean>;
  
  constructor(private dataFilterManagerService: DataFilterManagerService) { }

  ngOnInit(): void {
    this.isOpen$ = this.dataFilterManagerService.isOpen();
    this.isOpen$.pipe(this.detacher.takeUntilDetach()).subscribe(isOpen => this.isHidden = isOpen);
  }

  open(): void {
    this.dataFilterManagerService.open();
  }
}
