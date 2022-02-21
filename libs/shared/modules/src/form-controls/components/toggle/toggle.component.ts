import { ChangeDetectorRef, Component, HostListener, Injector, EventEmitter, Output } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [MakeProvider(ToggleComponent)],
})
export class ToggleComponent extends AbstractValueAccessor {
  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
  }

  @HostListener('click')
  private onClick(): void {
    this.value = !this.value;
    this.changeValue.emit({ toggle: this.value });
  }

  @Output()
  changeValue = new EventEmitter<{ toggle: boolean }>();
  
  writeValue(value: any): void {
    super.writeValue(value);
    this.cd.detectChanges();
  }
}
