import { PluginStaticStateBaseComponent } from './../plugin-static-state-base/plugin-static-state-base.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Component, Input, TemplateRef, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-plugin-custom-state',
  templateUrl: './plugin-custom-state.component.html',
  styleUrls: ['./plugin-custom-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginCustomStateComponent extends PluginStaticStateBaseComponent implements OnInit, OnDestroy {
  get footerDisplayed(): boolean {
    return this.displayFooter || !!this.footerTemplate;
  }

  get headerDisplayed(): boolean {
    return this.displayHeader;
  }

  @Input()
  contentTemplate: TemplateRef<any>;

  @Input()
  customDescriptionTranslationKey?: string;

  @Input()
  footerTemplate: TemplateRef<any>;

  @Input()
  aboveFooterContentTemplate: TemplateRef<any>;

  @Input()
  leftSideHeaderContent: TemplateRef<any>;

  @Input()
  playSuccessAnimation: boolean;

  @Output()
  closeBtnClick = new EventEmitter<any>(true);

  constructor(switcher: ComponentSwitcherDirective, cd: ChangeDetectorRef) {
    super(switcher, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
