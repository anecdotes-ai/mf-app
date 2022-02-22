import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SamlFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SsoConnectionComponent } from './sso-connection.component';

describe('SsoConnectionComponent', () => {
  let component: SsoConnectionComponent;
  let fixture: ComponentFixture<SsoConnectionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SsoConnectionComponent],
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: ComponentSwitcherDirective, useValue: {} },
          { provide: SamlFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoConnectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
