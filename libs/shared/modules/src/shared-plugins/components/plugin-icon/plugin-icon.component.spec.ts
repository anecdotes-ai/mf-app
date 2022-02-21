/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PluginIconComponent } from './plugin-icon.component';

describe('PluginIconComponent', () => {
  let component: PluginIconComponent;
  let fixture: ComponentFixture<PluginIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
