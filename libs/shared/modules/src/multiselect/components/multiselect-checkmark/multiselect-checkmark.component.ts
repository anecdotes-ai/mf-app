import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { MultiselectHostComponent } from './../multiselect-host/multiselect-host.component';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-multiselect-checkmark',
  templateUrl: './multiselect-checkmark.component.html',
  styleUrls: ['./multiselect-checkmark.component.scss'],
})
export class MultiselectCheckmarkComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  checkboxValue: boolean = null;

  @Input()
  item: any;

  @Output()
  valueChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private multiselectHost: MultiselectHostComponent) { }

  ngOnInit(): void {
    this.multiselectHost.itemsSelection$.pipe(filter(() => this.item), this.detacher.takeUntilDetach()).subscribe((selectedItemsMap) => {
      const itemSelected = selectedItemsMap.has(this.multiselectHost.selectDefinition(this.item));

      if (this.checkboxValue !== itemSelected) {
        this.checkboxValue = itemSelected;
        this.valueChange.emit(itemSelected);
      }
    });
  }

  changeItemSelection(selected: boolean): void {
    if (selected) {
      this.multiselectHost.selectItem(this.item);
    } else if (selected === false) {
      this.multiselectHost.unselectItem(this.item);
    }
    this.valueChange.emit(selected);
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

}
