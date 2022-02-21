import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FilterDefinition } from 'core/modules/data-manipulation/data-filter';
import { BaseDataFilterComponent } from '../base-data-filter/base-data-filter.component';

@Component({
  selector: 'app-simple-data-filter',
  templateUrl: './simple-data-filter.component.html',
  styleUrls: ['./simple-data-filter.component.scss'],
})
export class SimpleDataFilterComponent extends BaseDataFilterComponent implements OnInit {
  @Input()
  filteringDefinition: FilterDefinition<any>[];

  @Input()
  data: any[];

  constructor(public cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit(): void {
    super.initialize();
  }
}
