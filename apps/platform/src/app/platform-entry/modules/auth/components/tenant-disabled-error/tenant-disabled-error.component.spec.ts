/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TenantDisabledErrorComponent } from './tenant-disabled-error.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TenantDisabledErrorComponent', () => {
  let component: TenantDisabledErrorComponent;
  let fixture: ComponentFixture<TenantDisabledErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TenantDisabledErrorComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantDisabledErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
