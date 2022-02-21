import { Component, Input, OnInit } from '@angular/core';
import { ControlsFacadeService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { CalculatedControl } from 'core/modules/data/models';

@Component({
  selector: 'app-control-view-item',
  templateUrl: './control-view-item.component.html',
})
export class ControlViewItemComponent implements OnInit {
  @Input()
  controlId: string;

  control$: Observable<CalculatedControl>;

  constructor(private controlFacade: ControlsFacadeService) {}

  ngOnInit(): void {
    this.control$ = this.controlFacade.getSingleControlOrSnapshot(this.controlId);
  }

  buildTranslationKey(key: string): string {
    return `controlPreview.controlViewItem.${key}`;
  }
}
