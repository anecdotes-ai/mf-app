import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, ViewChild } from '@angular/core';
import { DropdownBaseComponent } from '../dropdown-base/dropdown-base.component';

@Component({
  selector: 'app-three-dots-menu',
  templateUrl: './three-dots-menu.component.html',
  styleUrls: ['./three-dots-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreeDotsMenuComponent extends DropdownBaseComponent {
  @ViewChild(CdkConnectedOverlay, { static: true })
  private cdkConnectedOverlay: CdkConnectedOverlay;

  /**
   * The value of this attribute is used by auto-tests so that they can detect overlay panel
   * that is rendered outside of that component
   */
  @HostBinding('attr.aria-controls')
  private get instanceId(): string {
    return this.cdkConnectedOverlay?.overlayRef?.overlayElement.id;
  }

  @HostBinding('class')
  @Input()
  dotsType: 'dark' | 'light' = 'dark';

  @Input()
  listWidth: 'small' | 'medium' = 'medium';

  @Input()
  disabled: boolean;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  open(): void {
    this.isOpen = true;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  close(): void {
    this.isOpen = false;
    this.cd.detectChanges();
  }

  toggle(): void {
    if(this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}
