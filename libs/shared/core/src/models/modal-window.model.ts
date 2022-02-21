import { TemplateRef } from '@angular/core';
import { ComponentToSwitch } from 'core/modules/component-switcher';

export interface ModalWindowBaseOptions {
  closeBtnDisplay?: boolean;
  displayBackground?: boolean;
  closeOnBackgroundClick?: boolean;
  onClose?: () => void;
}

export interface ModalWindowBase<TContext = any> {
  id?: string;
  context?: TContext;
  options?: ModalWindowBaseOptions;
}

export interface ModalWindow<TContext = any> extends ModalWindowBase<TContext> {
  template: TemplateRef<TContext>;
}

export interface ModalWindowWithSwitcher<TContext = any> extends ModalWindowBase<TContext> {
  componentsToSwitch: ComponentToSwitch[];
}

export interface ModalWindowEntityWrapper<TContext = any> {
  window: ModalWindowBase<TContext>;
  templateWindow?: ModalWindow<TContext>;
  switcherWindow?: ModalWindowWithSwitcher<TContext>;
  type: 'window' | 'alert' | 'switcher';
}
