import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-add-option',
  templateUrl: './add-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOptionComponent {
  @Input()
  value: string;

  @Input()
  entityNameText: string;

  @HostBinding('class.pointer-events-none')
  @Input()
  disabled: boolean;
}
