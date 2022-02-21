import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveReportFooterComponent } from './executive-report-footer.component';

describe('ExecutiveReportFooterComponent', () => {
  let component: ExecutiveReportFooterComponent;
  let fixture: ComponentFixture<ExecutiveReportFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutiveReportFooterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveReportFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
