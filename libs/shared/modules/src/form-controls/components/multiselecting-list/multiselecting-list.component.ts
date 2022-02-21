import { MultiselectTypes } from './../../constants/multiselectable-list.constants';
import { MultiselectingItem } from 'core/models';
import { EventEmitter, HostBinding, Injector, Input, Output, Component } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-multiselectable-list',
  templateUrl: './multiselecting-list.component.html',
  styleUrls: ['./multiselecting-list.component.scss'],
})
export class MultiselectableListComponent extends AbstractValueAccessor {
  @Input()
  itemsList: MultiselectingItem[];

  @HostBinding('class')
  @Input()
  type: MultiselectTypes = 'big';

  @Output()
  select = new EventEmitter<MultiselectingItem>();

  constructor(injector: Injector) {
    super(injector);
  }

  selectionItemHandler(item: MultiselectingItem): void {
    item.selected = !item.selected;
    this.select.emit(item);
  }
}
