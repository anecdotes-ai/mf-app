// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SvgIconsModule } from '../../../svg-icons';
import { TranslateConfigModule } from '../../../translate-config';
import { ExclusiveFeatureModalService } from '../../services/exclusive-feature-modal/exclusive-feature-modal.service';
import { ExclusiveFeatureButtonComponent } from './exclusive-feature-button.component';

export default {
  title: 'Atoms/Buttons/Exclusive feature Button',
  component: ExclusiveFeatureButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot()],
      providers: [{ provide: ExclusiveFeatureModalService, useValue: {} }]
    }),
  ],
} as Meta;

const Template: Story<ExclusiveFeatureButtonComponent> = (args: ExclusiveFeatureButtonComponent) => ({
  props: args,
  template: '<app-exclusive-feature-button>Hover me</app-exclusive-feature-button>',
});

export const ExclusiveFeatureButtonPrimary = Template.bind({});
ExclusiveFeatureButtonPrimary.args = {
  type: 'primary',
  icon: 'adopt',
};

export const ExclusiveFeatureButtonSecondary = Template.bind({});
ExclusiveFeatureButtonSecondary.args = {
  type: 'secondary',
  icon: 'adopt',
};

export const ExclusiveFeatureButtonDisabledSecondary = Template.bind({});
ExclusiveFeatureButtonDisabledSecondary.args = {
  type: 'secondary',
  icon: 'adopt',
  disabled: true,
};

export const ExclusiveFeatureButtonDisabledPrimary = Template.bind({});
ExclusiveFeatureButtonDisabledPrimary.args = {
  type: 'primary',
  icon: 'adopt',
  disabled: true,
};
