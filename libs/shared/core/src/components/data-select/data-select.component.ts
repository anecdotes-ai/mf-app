import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { WindowHelperService } from '../../services/window-helper/window-helper.service';
import { Subject } from 'rxjs';
import { DataSelectDefinition } from '../../models';
import { deepEqual } from 'core/utils';

@Component({
  selector: 'app-data-select',
  templateUrl: './data-select.component.html',
  styleUrls: ['./data-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSelectComponent implements OnChanges {
  private hostElement: HTMLElement;

  @Input()
  dataSelectDefinition: DataSelectDefinition<any>;

  @Input()
  icon: string;

  @Input()
  data: any[];

  @Input()
  saveState: boolean;

  @Input()
  trackBy: (x) => any;

  @Output()
  select = new EventEmitter(true);

  selectedItem: any;

  menuOpened = new Subject<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private windowHelper: WindowHelperService,
    elementRef: ElementRef
  ) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      let updated;
      if (this.selectedItem) {
        updated = this.data.find(item => this.trackBy(item) === this.trackBy(this.selectedItem));
        if (deepEqual(updated, this.selectedItem)) {
          return;
        }
      }
      if (!this.trySetItemFromQueryParams() && !this.trySetItemFromLocalStorage()) {
        const dataItem = updated ? updated : this.data[0];
        this.selectItemWithoutChangeDetection(dataItem);
        this.setQueryParams(dataItem);
      }
    }
  }

  selectItem(dataItem: any): void {
    this.selectItemWithoutChangeDetection(dataItem);
    this.router.navigate([], {
      queryParams: { [this.dataSelectDefinition.fieldId]: this.dataSelectDefinition.idSelector(dataItem) },
    });
    this.saveStateToLocalStorage(dataItem);
    this.cd.detectChanges();
  }

  private selectItemWithoutChangeDetection(dataItem: any): void {
    this.selectedItem = dataItem;
    this.select.emit(this.selectedItem);
  }

  private trySetItemFromQueryParams(): boolean {
    if (this.router.routerState.snapshot.root.queryParams[this.dataSelectDefinition.fieldId]) {
      const foundValue = this.data.find(
        (x) =>
          this.dataSelectDefinition.idSelector(x) ===
          this.router.routerState.snapshot.root.queryParams[this.dataSelectDefinition.fieldId]
      );

      if (foundValue) {
        this.selectItemWithoutChangeDetection(foundValue);
        return true;
      }
    }
  }

  private trySetItemFromLocalStorage(): boolean {
    if (this.saveState && this.hostElement.id) {
      const localStorageValue = this.windowHelper.getWindow().localStorage.getItem(this.generateLocalStorageKey());

      if (localStorageValue) {
        const foundValue = this.data.find((x) => this.dataSelectDefinition.idSelector(x) === localStorageValue);

        if (foundValue) {
          this.selectItemWithoutChangeDetection(foundValue);
          return true;
        }
      }
    }
  }

  private saveStateToLocalStorage(dataItem: any): void {
    if (this.saveState) {
      this.windowHelper
        .getWindow()
        .localStorage.setItem(this.generateLocalStorageKey(), this.dataSelectDefinition.idSelector(dataItem));
    }
  }

  private setQueryParams(dataItem: any): void {
    this.router.navigate([], {
      queryParams: {
        ...this.router.routerState.snapshot.root.queryParams,
        [this.dataSelectDefinition.fieldId]: this.dataSelectDefinition.idSelector(dataItem),
      },
    });
  }

  private generateLocalStorageKey(): string {
    return `data-select-${this.hostElement.id}`;
  }
}
