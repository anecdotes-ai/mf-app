/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimeframeViewComponent } from './timeframe-view.component';

describe('TimeframeViewComponent', () => {
  let component: TimeframeViewComponent;
  let fixture: ComponentFixture<TimeframeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeframeViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeframeViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
