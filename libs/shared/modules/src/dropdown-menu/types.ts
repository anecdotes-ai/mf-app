import { TemplateRef } from '@angular/core';
import { Dictionary } from '@ngrx/entity';

export interface MenuAction<T = any> {
  translationKey?: string;
  translationKeyParams?: Dictionary<string>;
  showOnlyOnSearch?: boolean;
  shouldResetOnClick?: boolean;
  translationKeyFactory?: (ctx?: T) => string;
  action?: (ctx?: T) => Promise<any> | any;
  displayCondition?: (ctx?: T) => boolean;
  disabledCondition?: (ctx?: T) => boolean;
  disabled?: boolean;
  value?: any;
  icon?: string;
  id?: string;
  iconColorMode?: 'stroke' | 'fill' | 'transparent';
  visibleFor?: string[];
}

export declare type TabSize = 'small' | 'medium' | 'large' | 'relative';

export interface TabModel {
  translationKey?: string;
  tabTemplate?: TemplateRef<any>;
  count?: number;
  context?: any;
  icon?: string;
  tabId?: number | string | any;
  routerLink?: string;
  progress?: number;
  progressColor?: string;
  visibleFor?: string[];
}
