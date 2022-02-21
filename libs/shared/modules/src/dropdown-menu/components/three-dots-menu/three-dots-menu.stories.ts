import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { MenuAction } from 'core/modules/dropdown-menu';
import { TranslateConfigModule } from '../../../translate-config';
import { DropdownMenuModule } from '../../dropdown-menu.module';
import { ThreeDotsMenuComponent } from './three-dots-menu.component';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { Component, ContentChild, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  template: `
    <ng-content></ng-content>
  `
})
class WrapperComponent implements OnChanges {

  @ContentChild(ThreeDotsMenuComponent, { static: true })
  private dropdown: ThreeDotsMenuComponent;

  @Input()
  openDropdown: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if('openDropdown' in changes) {
      if(this.openDropdown) {
        this.dropdown.open();
      } else if(!this.openDropdown){
        this.dropdown.close();
      }
    }
    }, 500); 
  }
}

export default {
  title: 'Moleculas/Dropdowns/Menus/Three dots menu',
  component: ThreeDotsMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, DropdownMenuModule, TranslateConfigModule, SvgIconsModule.forRoot(), BrowserAnimationsModule],
      declarations: [WrapperComponent]
    }),
    componentWrapperDecorator((story) => `<div style="margin: 4em">${story}</div>`),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} as Meta;

function createBaseMenuActions(): MenuAction[] {
  return [
    {
      translationKey: 'Audit zone',
      action: () => {
        /* eslint-disable no-console */
        console.log('action one');
      },
    },
    {
      translationKey: 'Abandon framework',
      icon: 'add_req_framework',
      action: () => {
        /* eslint-disable no-console */
        console.log('action two');
      },
    },
  ];
}

const Template: Story<ThreeDotsMenuComponent> = (args: ThreeDotsMenuComponent) => ({
  props: args,
  template: `
    <app-wrapper [openDropdown]="openDropdown">
      <app-three-dots-menu></app-three-dots-menu>
    </app-wrapper>
  `
});

export const MediumListSize = Template.bind({});
MediumListSize.args = {
  menuActions: createBaseMenuActions(),
};

export const SmallListSize = Template.bind({});
SmallListSize.args = {
  menuActions: createBaseMenuActions(),
  listWidth: 'small'
};

export const LightDots = Template.bind({});
LightDots.parameters = {
  background: { default: 'blue' }
};

LightDots.args = {
  menuActions: createBaseMenuActions(),
  dotsType: 'light',
};

export const WithDisabledOptions = Template.bind({});

WithDisabledOptions.args = {
  menuActions: createBaseMenuActions().map(opt => ({...opt, disabled: true})),
  openDropdown: true
};
