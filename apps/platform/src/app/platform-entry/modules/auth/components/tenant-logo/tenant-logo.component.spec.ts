/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TenantLogoComponent } from './tenant-logo.component';
import { TenantFacadeService } from 'core/modules/auth-core/services';

describe('TenantLogoComponent', () => {
  let component: TenantLogoComponent;
  let fixture: ComponentFixture<TenantLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantLogoComponent ],
      providers: [{ provide: TenantFacadeService, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantLogoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
