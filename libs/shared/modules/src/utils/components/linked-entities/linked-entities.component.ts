import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LinkedEntitiesGroup, LinkedEntity } from '../../types';

@Component({
  selector: 'app-linked-entities',
  templateUrl: './linked-entities.component.html',
  styleUrls: ['./linked-entities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkedEntitiesComponent {
  private _linkedEntitiesGroups: LinkedEntitiesGroup[];
  private _overallEntitiesCount: number;

  get linkedEntitiesGroups(): LinkedEntitiesGroup[] {
    return this._linkedEntitiesGroups;
  }

  @Input()
  set linkedEntitiesGroups(v: LinkedEntitiesGroup[] ) {
    this._linkedEntitiesGroups = v;
    this._overallEntitiesCount = this.getOverallEntitiesCount();
  }

  @Input()
  textInLabel: string;

  @Input()
  textInTooltip: string;

  @Output()
  linkClick = new EventEmitter<LinkedEntity>();

  get overallEntitiesCount(): number {
    return this._overallEntitiesCount;
  }

  private getOverallEntitiesCount(): number {
    return this.linkedEntitiesGroups?.reduce((result, group) => result + (group.entities?.length || 0), 0);
  }
}
