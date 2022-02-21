import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Output()
  mainActionClick = new EventEmitter();

  @Input()
  mainDescriptionText: string;

  @Input()
  secondaryDescriptionText: string;

  @Input()
  mainButtonText: string;

  @Input()
  includePlugins: boolean;

  @Input()
  mainButtonIcon: string;
}
