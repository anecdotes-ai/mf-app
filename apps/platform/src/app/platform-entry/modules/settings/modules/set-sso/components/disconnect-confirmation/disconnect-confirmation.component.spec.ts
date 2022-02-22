import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SamlFacadeService } from 'core/modules/auth-core/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { DisconnectConfirmationComponent } from './disconnect-confirmation.component';

describe('DisconnectConfirmationComponent', () => {
  let component: DisconnectConfirmationComponent;
  let fixture: ComponentFixture<DisconnectConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectConfirmationComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: ComponentSwitcherDirective, useValue: {}},
        {provide: SamlFacadeService, useValue: {}},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
