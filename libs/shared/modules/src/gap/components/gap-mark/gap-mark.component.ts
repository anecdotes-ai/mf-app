import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gap-mark',
  templateUrl: './gap-mark.component.html',
  styleUrls: ['./gap-mark.component.scss']
})
export class GapMarkComponent {

  @Input()
  tooltipText: string;

  @Input()
  tooltipPlacement = 'top';

}
