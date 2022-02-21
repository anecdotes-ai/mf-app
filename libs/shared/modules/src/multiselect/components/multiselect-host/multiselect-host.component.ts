import { MultiselectButtonDefinition } from './../../models/multiselect-button.model';
import { Component, HostBinding, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuAction } from 'core/modules/dropdown-menu';

@Component({
  selector: 'app-multiselect-host',
  templateUrl: './multiselect-host.component.html',
  styleUrls: ['./multiselect-host.component.scss']
})
export class MultiselectHostComponent implements OnChanges {
  readonly selectedItemsMap: Map<string, any> = new Map();
  readonly itemsSelection$: BehaviorSubject<Map<string, any>> = new BehaviorSubject(this.selectedItemsMap);

  selectAllCheckmark: boolean;
  isLoadingState$: Subject<boolean> = new Subject();

  @Input() items: any[];

  @Input() actionButtons: MultiselectButtonDefinition[];

  @Input() threeDotsMenu: MenuAction<any>[];

  @Input() selectDefinition: (item: any) => any;

  @HostBinding('class.visible')
  get isMultiselectVisible(): boolean {
    return !!this.selectedItemsMap?.size;
  }

  @HostListener('document:keydown.escape', ['$event'])
  private onKeydownHandler(event: KeyboardEvent): void {
    this.selectAll(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('threeDotsMenu' in changes) {
      this.wrapMultiselectAction(this.threeDotsMenu);
    }

    if ('actionButtons' in changes) {
      this.wrapMultiselectAction(this.actionButtons);
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `multiselect.${relativeKey}`;
  }

  selectAll(checkmarkData: boolean | null): void {
    if (checkmarkData) {
      this.selectedItemsMap.clear();
      this.items.forEach((element) => {
        this.selectedItemsMap.set(this.selectDefinition(element), element);
      });
      this.itemsSelection$.next(this.selectedItemsMap);

      // Force reassign checkmark value in case if this method esed externally, not as a valueChnage handler for ckeckbox
      this.selectAllCheckmark = this.areAllSelected();
    } else if (checkmarkData === false) {
      this.selectedItemsMap.clear();
      this.itemsSelection$.next(this.selectedItemsMap);

      // Force reassign checkmark value
      this.selectAllCheckmark = this.areAllSelected();
    }
  }

  selectItem(item: any): void {
    this.selectedItemsMap.set(this.selectDefinition(item), item);
    this.itemsSelection$.next(this.selectedItemsMap);
  }

  unselectItem(item: any): void {
    this.selectedItemsMap.delete(this.selectDefinition(item));
    this.itemsSelection$.next(this.selectedItemsMap);
  }

  areAllSelected(): boolean { return this.items.length === this.selectedItemsMap.size; }

  private wrapMultiselectAction(objects: { action?: (args: any) => Promise<any> | any }[]): void {
    objects.forEach((objWithAction, index) => {
      if (objects[index].action) {
        objects[index].action = this.createActionWithMultiselectObject.bind(this, objWithAction.action.bind(this));
      }
    });
  }

  private async createActionWithMultiselectObject(action: (...args: any) => Promise<any> | any): Promise<void> {
    this.isLoadingState$.next(true);
    await action(this.selectedItemsMap);
    this.selectAll(false);
    this.isLoadingState$.next(false);
  }
}
