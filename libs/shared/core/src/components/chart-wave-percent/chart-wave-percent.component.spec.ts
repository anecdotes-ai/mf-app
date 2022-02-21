import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartWavePercentComponent } from './chart-wave-percent.component';

describe('ChartWavePercentComponent', () => {
  let component: ChartWavePercentComponent;
  let fixture: ComponentFixture<ChartWavePercentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartWavePercentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWavePercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
