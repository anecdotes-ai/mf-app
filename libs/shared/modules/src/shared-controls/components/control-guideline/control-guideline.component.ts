import {
  ControlGuidelineModalWindowInputKeys,
  guidelineTabKeys,
} from './constants/control-guideline.constants';
import { GuidelineTabModel } from './../../models/guideline-tab.model';
import { Framework } from 'core/modules/data/models/domain';
import { CalculatedControl } from './../../../data/models/calculated-control.model';
import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { Component, Input, OnInit } from '@angular/core';
import { isFrameworkWithGuideline } from '../control-item/control-item.component';

@Component({
  selector: 'app-control-guideline',
  templateUrl: './control-guideline.component.html',
  styleUrls: ['./control-guideline.component.scss'],
})
export class ControlGuidelineComponent implements OnInit {
  inTabsMode = false;
  tabs: GuidelineTabModel[];
  textToDisplay: string;
  titleText: string;

  @Input(ControlGuidelineModalWindowInputKeys.control)
  control: CalculatedControl = {};

  @Input(ControlGuidelineModalWindowInputKeys.framework)
  framework: Framework = {};

  constructor(private modalWindowService: ModalWindowService) { }

  ngOnInit(): void {
    if (isFrameworkWithGuideline(this.framework.framework_name)) {
      this.inTabsMode = true;
      this.tabs = Object.keys(this.control)
        .filter((key) => guidelineTabKeys[key])
        .map((key) => {
          return {
            textContent: this.control[key],
            translationKey: guidelineTabKeys[key],
            isActive: false,
          };
        });
      this.selectTab(this.tabs[0]);
    }
  }

  onCloseBtnClick(): void {
    this.modalWindowService.close();
  }

  selectTab(selectedTab: GuidelineTabModel): void {
    this.tabs.forEach((tab) => {
      tab.isActive = false;
    });
    selectedTab.isActive = true;
    this.textToDisplay = selectedTab.textContent;
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.guideline.${relativeKey}`;
  }
}
