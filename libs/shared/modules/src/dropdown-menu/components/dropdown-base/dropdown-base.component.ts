import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MenuAction } from '../../types';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-dropdown-base',
  template: '',
})
export abstract class DropdownBaseComponent implements OnDestroy {
  private detacher = new SubscriptionDetacher();

  @ViewChild('menuTrigger')
  protected menuTrigger: MatMenuTrigger;

  protected _dirty: boolean;

  @HostBinding('class.hidden')
  protected get areAllActionsHidden(): boolean {
    return this.menuActions && !this.menuActions.some((x) => !x.displayCondition || x.displayCondition(this.context));
  }

  isOpen: boolean;

  @Input()
  parentMenuTemplate: TemplateRef<any>;

  @Input()
  menuActions: MenuAction[];

  @Input()
  menuOverlayClass: string;

  @Input()
  context: any;

  @Output()
  opened: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  dirty: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(protected cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.menuTrigger?.menuOpened.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.menuOpened());
    this.menuTrigger?.menuClosed.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.menuClosed());
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  open(): void {
    this.menuTrigger?.openMenu();
  }

  close(): void {
    this.menuTrigger?.closeMenu();
  }

  private menuOpened(): void {
    this.isOpen = true;

    if (!this._dirty) {
      this.dirty.emit(true);
      this._dirty = true;
    }

    this.opened.emit(true);
    this.cd.detectChanges();
  }

  private menuClosed(): void {
    this.isOpen = false;
    this.closed.emit(true);
    this.cd.detectChanges();
  }
}
