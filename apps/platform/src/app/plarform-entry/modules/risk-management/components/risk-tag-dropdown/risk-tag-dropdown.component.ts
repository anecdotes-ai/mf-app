import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { notSetClass, NOT_SET } from '../../constants';

@Component({
  selector: 'app-risk-tag-dropdown',
  templateUrl: './risk-tag-dropdown.component.html',
  styleUrls: ['./risk-tag-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskTagDropdownComponent implements OnInit {
  @Input()
  ratingItems: string[];
  @Input()
  itemsTranslationKey: string;
  @Input()
  itemSelectedAction: () => void;
  @Input()
  itemsBGClasses: object = {};
  @Input()
  currentValue = this.buildTranslationKey(NOT_SET);
  @Input()
  isReadOnly = false;

  menuActions: MenuAction[];
  buttonBGClass = notSetClass;

  get hasValue(): boolean {
    return this.currentValue !== this.buildTranslationKey(NOT_SET);
  }

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.createMenuActions();
  }

  clearSelected(): void {
    this.buttonBGClass = notSetClass;
    this.currentValue = this.buildTranslationKey(NOT_SET);
    this.cd.detectChanges();
  }

  dropDownMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.${relativeKey}`;
  }

  private createMenuActions(): void {
    this.menuActions = this.ratingItems?.map((item) => {
      return {
        translationKey: this.buildTranslationKey(`${this.itemsTranslationKey}.${item}`),
        action: () => this.onItemSelected(item),
      };
    });
  }

  private onItemSelected(item: string): any {
    this.currentValue = this.buildTranslationKey(`${this.itemsTranslationKey}.${item}`);
    this.buttonBGClass = this.itemsBGClasses[item];
    this.cd.detectChanges();

    if (this.itemSelectedAction) {
      this.itemSelectedAction();
    }
  }
}
