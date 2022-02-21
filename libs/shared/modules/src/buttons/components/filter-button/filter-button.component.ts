import { Component, HostBinding } from '@angular/core';
import { ButtonType } from '../../types';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent {
  @HostBinding('class')
  private classes = 'btn custom-size';
  @HostBinding('attr.type')
  private type: ButtonType = 'primary';

  @HostBinding('attr.role')
  private role = 'button';
}
