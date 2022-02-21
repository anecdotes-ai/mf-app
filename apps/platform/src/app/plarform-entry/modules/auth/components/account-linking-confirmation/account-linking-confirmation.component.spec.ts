import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WindowHelperService } from 'core';
import { AuthService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { AccountLinkingConfirmationComponent } from './account-linking-confirmation.component';

describe('AccountLinkingConfirmationComponent', () => {
  let component: AccountLinkingConfirmationComponent;
  let fixture: ComponentFixture<AccountLinkingConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLinkingConfirmationComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: WindowHelperService, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLinkingConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
