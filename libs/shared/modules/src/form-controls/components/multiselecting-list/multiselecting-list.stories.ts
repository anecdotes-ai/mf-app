import { Framework } from 'core/modules/data/models/domain';
import { MultiselectableListComponent } from './multiselecting-list.component';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MultiselectingItem } from 'core/models';
import { TranslateModule } from '@ngx-translate/core';

const framework: Framework = {
  framework_id: '790499088',
  framework_name: 'Framework Name',
};

const itemsToDemonstrate: MultiselectingItem<Framework>[] = [];
const itemsToDemonstrate2: MultiselectingItem<Framework>[] = [];
const itemsToDemonstrate3: MultiselectingItem<Framework>[] = [];
const itemsToDemonstrate4: MultiselectingItem<Framework>[] = [];

for (let i = 0; i < 10; i++) {
  itemsToDemonstrate.push({
    translationKey: 'HIPAA',
    data: framework,
    icon: `frameworks/${framework.framework_id}`,
  });
}

for (let i = 0; i < 10; i++) {
  itemsToDemonstrate2.push({
    translationKey: 'AWS plugin information',
    icon: `aws-plugin-icon`,
  });
}

for (let i = 0; i < 10; i++) {
  itemsToDemonstrate3.push({
    icon: `aws-plugin-icon`,
  });
}

for (let i = 0; i < 10; i++) {
  itemsToDemonstrate4.push({
    translationKey: 'AWS plugin information',
  });
}

export default {
  title: 'Multiselectable-list component',
  component: MultiselectableListComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SvgIconsModule.forRoot(), TranslateModule.forRoot()],
      declarations: [],
      providers: [],
    }),
  ],
} as Meta;

const Template: Story<MultiselectableListComponent> = (args: MultiselectableListComponent) => ({
  props: args,
});

export const frameworksList = Template.bind({});
frameworksList.args = {
  itemsList: itemsToDemonstrate,
};

export const frameworksListSmall = Template.bind({});
frameworksListSmall.args = {
  itemsList: itemsToDemonstrate,
  type: 'small',
};

export const pluginsList = Template.bind({});
pluginsList.args = {
  itemsList: itemsToDemonstrate2,
};

export const pluginsListSmall = Template.bind({});
pluginsListSmall.args = {
  itemsList: itemsToDemonstrate2,
  type: 'small',
};

export const textList = Template.bind({});
textList.args = {
  itemsList: itemsToDemonstrate4,
};

export const iconsList = Template.bind({});
iconsList.args = {
  itemsList: itemsToDemonstrate3,
};
