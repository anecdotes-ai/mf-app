import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ControlsReportHeaderComponent } from './controls-report-header.component';

describe('ControlsReportHeaderComponent', () => {
  configureTestSuite();
  let component: ControlsReportHeaderComponent;
  let fixture: ComponentFixture<ControlsReportHeaderComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlsReportHeaderComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
