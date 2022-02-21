import { Component, Input } from '@angular/core';
import {
  SpecificInformationContent,
  SpecificInformationContentValueTypes,
} from '../../models/specific-information-content.model';
import { getPercents } from 'core/utils';

@Component({
  selector: 'app-specific-information-item',
  templateUrl: './specific-information-item.component.html',
  styleUrls: ['./specific-information-item.component.scss'],
})
export class SpecificInformationItemComponent {
  @Input()
  content: SpecificInformationContent;

  specificContentRowValueTypes = SpecificInformationContentValueTypes;

  public getPercentsFunc = getPercents;
}
