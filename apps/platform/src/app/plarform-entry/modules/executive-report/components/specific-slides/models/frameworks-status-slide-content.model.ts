import { Framework } from 'core/modules/data/models/domain';

export interface FrameworksStatusSlideContentData {
  frameworks: Framework[];
}

export interface ControlsStatusBarSection {
  cssClass: string;
  controlsAmount: number;
  width: string;
}
