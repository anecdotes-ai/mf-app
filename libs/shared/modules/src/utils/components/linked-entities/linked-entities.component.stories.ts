import { LinkedEntitiesComponent } from './linked-entities.component';
import { TranslateConfigModule } from 'core/modules/translate-config';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'core/modules/directives';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'Atoms/Utils/Linked Entities',
  component: LinkedEntitiesComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        NgbTooltipModule,
        DirectivesModule,
        RouterTestingModule,
        SvgIconsModule.forRoot(),
        TranslateConfigModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<LinkedEntitiesComponent> = (args: LinkedEntitiesComponent) => ({
  props: {
    ...args,
    textInLabel: 'linked',
    textInTooltip: 'LINKED',
  } as LinkedEntitiesComponent,
  template:
    '<app-linked-entities style="margin-top:250px; margin-left: 200px" [linkedEntitiesGroups]="linkedEntitiesGroups" [textInLabel]="textInLabel" [textInTooltip]="textInTooltip"></app-linked-entities>',
});

export const WithLinkedEntitiesGroup = Template.bind({});
WithLinkedEntitiesGroup.args = {
  linkedEntitiesGroups: [
    {
      title: 'Fake group 1',
      entities: [
        {
          title: 'fake entity 1',
          id: 'fake1',
        },
        {
          title: 'fake entity 2',
          id: 'fake2',
        },
      ],
    },
    {
      title: 'Fake group 2',
      entities: [
        {
          title: 'fake entity 3',
          id: 'fake3',
        },
      ],
    },
  ],
} as LinkedEntitiesComponent;

export const LinkedEntitiesGroupNotSpecified = Template.bind({});
LinkedEntitiesGroupNotSpecified.args = {
  linkedEntitiesGroups: undefined,
} as LinkedEntitiesComponent;
