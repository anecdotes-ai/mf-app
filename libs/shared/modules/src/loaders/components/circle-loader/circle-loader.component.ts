import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-circle-loader',
  templateUrl: './circle-loader.component.html',
  styleUrls: ['./circle-loader.component.scss'],
})
export class CircleLoaderComponent {
  @HostBinding('class')
  @Input() appearance: 'light'|'dark' = 'light';
}
