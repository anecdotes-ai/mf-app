import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { LoaderManagerService } from 'core';
import { ForgotAccountComponent } from './forgot-account.component';
import { TenantService } from 'core/modules/auth-core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('ForgotAccountComponent', () => {
  let component: ForgotAccountComponent;
  let fixture: ComponentFixture<ForgotAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotAccountComponent],
      providers: [LoaderManagerService, ComponentSwitcherDirective,
        TenantService],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
