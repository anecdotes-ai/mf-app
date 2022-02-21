import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StatusBarDefinition } from '../../types';
export interface StatusBarSection {
  cssClass: string;
  amount: number;
  width: number;
}

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBarComponent {
  @Input()
  set definition(definition: StatusBarDefinition[]) {
    this.statusBarSections = this.createStatusBarData(definition);
  }

  statusBarSections: StatusBarSection[] = [];

  private createStatusBarData(definition: StatusBarDefinition[]): StatusBarSection[] {
    if (definition?.length) {
      const maxValue = definition.map((val) => val.count).reduce((prev, curr) => prev + curr, 0);
      const lastItem = definition[definition.length - 1];
      const countable = definition.slice(0, definition.length - 1).map(
        (def) =>
          ({
            cssClass: def.cssClass,
            amount: def.count,
            width: (def.count / maxValue) * 100,
          } as StatusBarSection)
      );
      const lastPercent = 100 - countable.reduce((prev, curr) => prev + curr.width, 0);
      return [...countable, { cssClass: lastItem.cssClass, amount: lastItem.count, width: lastPercent }];
    } else {
      return [];
    }
  }
}
