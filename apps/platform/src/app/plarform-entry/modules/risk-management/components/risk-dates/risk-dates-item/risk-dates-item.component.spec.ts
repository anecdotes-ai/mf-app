import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDatesItemComponent } from './risk-dates-item.component';

describe('RiskDatesItemComponent', () => {
  let component: RiskDatesItemComponent;
  let fixture: ComponentFixture<RiskDatesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskDatesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDatesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
