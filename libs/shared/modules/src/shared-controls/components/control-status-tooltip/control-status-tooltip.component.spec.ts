import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ControlStatusTooltipComponent } from './control-status-tooltip.component';
import { ControlStatusEnum } from 'core/modules/data/models/domain';

describe('ControlStatusTooltipComponent', () => {
  configureTestSuite();
  let component: ControlStatusTooltipComponent;
  let fixture: ComponentFixture<ControlStatusTooltipComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ControlStatusTooltipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStatusTooltipComponent);
    component = fixture.componentInstance;
    component.controlStatus = { status: ControlStatusEnum.NOTSTARTED };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
