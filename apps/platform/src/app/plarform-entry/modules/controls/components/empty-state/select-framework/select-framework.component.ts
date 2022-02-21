import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Framework } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-select-framework',
  templateUrl: './select-framework.component.html',
  styleUrls: ['./select-framework.component.scss'],
})
export class SelectFrameworkComponent {
  @Input()
  frameworks: Framework[];

  @Input()
  selectedFrameworks: Set<Framework>;

  @Input()
  selectable = true;

  @Output()
  frameworkSelected = new EventEmitter<Framework>();

  selectFramework(framework: Framework): void {
    if (this.selectable) {
      this.frameworkSelected.emit(framework);
    }
  }
}
