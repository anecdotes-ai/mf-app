/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EvidenceEmptyStateComponent } from './evidence-empty-state.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EvidenceEmptyStateComponent', () => {
  let component: EvidenceEmptyStateComponent;
  let fixture: ComponentFixture<EvidenceEmptyStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EvidenceEmptyStateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceEmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
