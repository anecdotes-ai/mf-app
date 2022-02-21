import { Component, Input } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from 'core/modules/form-controls';

@Component({
  selector: 'app-dropdown-search-input',
  templateUrl: './dropdown-search-input.component.html',
  providers: [MakeProvider(DropdownSearchInputComponent)]
})
export class DropdownSearchInputComponent extends AbstractValueAccessor {
  @Input()
  placeholder: string;
}
