// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TranslateConfigModule } from 'core/modules/translate-config';
import { SortDefinition } from '../../models';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { DataSortComponent } from './data-sort.component';

@Component({
  selector: 'app-view-data-sort',
  template: `<app-data-sort
      [sortDefinitions]="sortDefinitions"
      [data]="data"
      (sort)="data = $event"
      (reverseSortData)="data = $event"
    ></app-data-sort>
    <div style="border:1px red #2a495b;" *ngFor="let item of data">String: {{ item.string }}. Number: {{ item.number }}</div>`,
})
class SortViewComponent {
  @Input()
  sortDefinitions: SortDefinition<any>[] = [];

  @Input()
  data: any[];
}

export default {
  title: 'Sort Component',
  component: DataSortComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslateConfigModule, CommonModule, SvgIconsModule.forRoot(), BrowserAnimationsModule],
      declarations: [SortViewComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            routerState: { snapshot: { root: { queryParams: { ['sortedBy']: 'name' } } } },
            navigate: (commands: any[], extras?: any) => {},
          },
        },
      ],
    }),
  ],
} as Meta;

const sortDefinitionInput = [
  {
    id: 'name',
    translationKey: 'sort by name',
    propertySelector: (c) => c.string,
  },
  {
    translationKey: 'sort by status',
    id: 'status',
    propertySelector: (c) => c.number,
  },
];
const sortDataInput = [
  {
    string: 'A',
    number: 2,
  },
  {
    string: 'C',
    number: 1,
  },
  {
    string: 'D',
    number: 3,
  },
  {
    string: 'B',
    number: 4,
  },
];

const Template: Story<SortViewComponent> = (args: DataSortComponent) => ({
  props: args,
  template: `
    <app-view-data-sort [sortDefinitions]="sortDefinitions" [data]="data"></app-view-data-sort>
  `
});

export const Primary = Template.bind({});
Primary.args = {
  sortDefinitions: sortDefinitionInput,
  data: sortDataInput,
};
