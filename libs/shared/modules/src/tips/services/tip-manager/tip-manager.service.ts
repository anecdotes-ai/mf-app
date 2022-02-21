import { HIDDEN_TIPS } from './../../constants/localstorageKeys.constants';
import { Injectable } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';

@Injectable({
  providedIn: 'root'
})
export class TipManagerService {

  constructor(private windowHelper: WindowHelperService) { }

  getHiddenTipsFromLocalStorage(): string[] {
    const { localStorage } = this.windowHelper.getWindow();
    return JSON.parse(localStorage.getItem(HIDDEN_TIPS)) || [];
  }

  setHiddenTipsToLocalStorage(hiddenTips: string[]): void {
    const { localStorage } = this.windowHelper.getWindow();
    localStorage.setItem(HIDDEN_TIPS, JSON.stringify(hiddenTips));
  }
}
