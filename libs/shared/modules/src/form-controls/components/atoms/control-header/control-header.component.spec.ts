import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ControlHeaderComponent } from './control-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

describe('ControlHeaderComponent', () => {
  configureTestSuite();

  let component: ControlHeaderComponent;
  let fixture: ComponentFixture<ControlHeaderComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlHeaderComponent],
      imports: [TranslateModule.forRoot(), NgbTooltipModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
