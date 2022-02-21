import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SamlFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SetSsoPageComponent } from './set-sso-page.component';

describe('SetSsoPageComponent', () => {
  let component: SetSsoPageComponent;
  let fixture: ComponentFixture<SetSsoPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetSsoPageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: SamlFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSsoPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
