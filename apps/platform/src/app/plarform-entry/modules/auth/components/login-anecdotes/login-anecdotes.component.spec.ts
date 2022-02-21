/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginAnecdotesComponent } from './login-anecdotes.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService, LoaderManagerService, LoggerService } from 'core';
import { TenantFacadeService } from 'core/modules/auth-core/services';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginAnecdotesComponent', () => {
  let component: LoginAnecdotesComponent;
  let fixture: ComponentFixture<LoginAnecdotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [LoginAnecdotesComponent],
      providers: [
        { provide: LoaderManagerService, useValue: {} },
        { provide: TenantFacadeService, useValue: {} },
        { provide: AppConfigService, useValue: {} },
        LoggerService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAnecdotesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
