/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LoaderManagerService, LoggerService, WindowHelperService } from 'core';
import { AuthService, FirebaseWrapperService } from 'core/modules/auth-core/services';
import { EmailCallbackComponent } from './email-callback.component';

describe('EmailCallbackComponent', () => {
  let component: EmailCallbackComponent;
  let fixture: ComponentFixture<EmailCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailCallbackComponent],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: FirebaseWrapperService, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
        LoggerService,
        { provide: ActivatedRoute, useValue: {} },
        { provide: LoaderManagerService, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCallbackComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
