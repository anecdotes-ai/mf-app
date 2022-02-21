import { TipManagerService } from './../../services';
import { Component, HostBinding, Input } from '@angular/core';
import { TipTypeEnum } from 'core/models';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss'],
})
export class TipComponent {
  @Input()
  tipId: string;

  @Input()
  tipType: TipTypeEnum = TipTypeEnum.TIP;

  @Input()
  tooltipPosition = 'top bottom';

  @Input()
  permanent = false;

  @HostBinding('class.hidden')
  private get isTipHidden(): boolean {
    const hiddenTips = this.tipManagerService.getHiddenTipsFromLocalStorage();
    return hiddenTips.includes(this.tipId);
  }

  @HostBinding('class.tip')
  private get isTipType(): boolean {
    return this.tipType === TipTypeEnum.TIP;
  }

  @HostBinding('class.notice')
  private get isNoticeType(): boolean {
    return this.tipType === TipTypeEnum.NOTICE;
  }

  @HostBinding('class.error')
  private get isErrorType(): boolean {
    return this.tipType === TipTypeEnum.ERROR;
  }

  get icon(): string {
    switch (this.tipType) {
      case TipTypeEnum.TIP:
        return 'tip';
      case TipTypeEnum.NOTICE:
        return 'tip_notice';
      case TipTypeEnum.ERROR:
        return 'tip_error';
    }
  }

  constructor(private tipManagerService: TipManagerService) {}

  closeTip(): void {
    const hiddenTips = this.tipManagerService.getHiddenTipsFromLocalStorage();
    hiddenTips.push(this.tipId);
    this.tipManagerService.setHiddenTipsToLocalStorage(hiddenTips);
  }

  buildTranslationKey(relativeKey: string): string {
    return `core.tip.${relativeKey}`;
  }
}
