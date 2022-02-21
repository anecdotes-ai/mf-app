import { TemplateRef } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';
export interface NavigationModel {
  route?: string;
  key?: string;
  text?: string;
  icon?: string;
  popupText?: string;
  visibleFor?: string[];
  inBeta?: boolean;
  menuActions?: MenuAction[];
  menuPositionY?: SubMenuPositionY;
  iconColorMode?: 'stroke' | 'fill' | 'mixed';
  menuTemplate?: TemplateRef<any>;
  notPaddedMenu?: boolean;
  notificationPositionX?: PositionX;
  displayBadge?: boolean;
}

export type SubMenuPositionY = 'above' | 'below' | 'center';
export const SubMenuPositionY = {
  ABOVE: 'above' as SubMenuPositionY,
  BELOW: 'below' as SubMenuPositionY,
  CENTER: 'center' as SubMenuPositionY,
};

export type PositionX = 'left' | 'right';
export const PositionX = {
  LEFT: 'left' as PositionX,
  RIGHT: 'right' as PositionX,
};
