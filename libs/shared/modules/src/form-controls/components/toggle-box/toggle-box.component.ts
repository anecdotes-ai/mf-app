import { ChangeDetectorRef, Component, EventEmitter, HostListener, Injector, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractValueAccessor } from '../abstract-value-accessor';
import { ToggleComponent } from '../toggle/toggle.component';


@Component({
  selector: 'app-toggle-box',
  templateUrl: './toggle-box.component.html',
  styleUrls: ['./toggle-box.component.scss']
})
export class ToggleBoxComponent extends AbstractValueAccessor {

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  iconSrc: string;
  
  @Input()
  comingSoon: boolean;

  @Output()
  changeValue = new EventEmitter<{ toggle: boolean }>();

  toggleControl = new FormControl(null);

  @HostListener('click')
  private onClick(): void {
    if (!this.comingSoon) {   
      this.value = !this.value;
      this.toggleControl.setValue(this.value);
      this.markAsDirty();
      this.changeValue.emit({ toggle: this.value });
    }
  }
  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
  }
  writeValue(value: boolean): void {
    this.toggleControl.setValue(value);
    if (this.value !== value) {
      this.value = value;
    }
  }

  toggle(): void {
    this.value = !this.value;
    this.markAsDirty();
    this.changeValue.emit({ toggle: this.value });
  }
}
