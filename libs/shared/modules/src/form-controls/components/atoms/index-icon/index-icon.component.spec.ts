/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndexIconComponent } from './index-icon.component';

describe('IndexIconComponent', () => {
  let component: IndexIconComponent;
  let fixture: ComponentFixture<IndexIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndexIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
