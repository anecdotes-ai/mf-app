import { TipManagerService } from 'core/modules/tips/components/tip/tip.component';
import { TranslateConfigModule } from 'core/modules/translate-config/translate-config.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { LoadersModule } from 'core/modules/loaders/loaders.module';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TipComponent } from './tip.component';
import { TipTypeEnum } from 'core/models';

class TipManagerServiceMock {
  private storage: string[] = [];
  getHiddenTipsFromLocalStorage = (): string[] => this.storage;
  setHiddenTipsToLocalStorage = (hiddenTips: string[]): void => { this.storage = hiddenTips; };
}

export default {
  title: 'Atoms/Tips/Tip',
  component: TipComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TranslateConfigModule, SvgIconsModule.forRoot(), LoadersModule, RouterModule, NgbTooltipModule],
      declarations: [],
      providers: [
        {
          provide: TipManagerService, useClass: TipManagerServiceMock
        }
      ]
    }),
  ],
} as Meta;

const Template: Story<TipComponent> = (args: TipComponent) => ({
  props: args,
  template: '<app-tip [tipType]="tipType" [tipId]="tipId">Jira plugin was connected successfully with permissions level that enabling you to collect Ticket History. To collect also Jira Workflows as an evidence, you should ask a Jira admin to re-connect the plugin - Invite IT user to do that.</app-tip>',
});

export const Tip = Template.bind({});
Tip.args = {
  tipType: TipTypeEnum.TIP,
  tipId: 'defaultTip',
};

export const Notice = Template.bind({});
Notice.args = {
  tipType: TipTypeEnum.NOTICE,
  tipId: 'noticeTip'
};

export const Error = Template.bind({});
Error.args = {
  tipType: TipTypeEnum.ERROR,
  tipId: 'errortTip'
};