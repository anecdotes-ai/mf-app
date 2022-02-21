/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { SsoConnectionSuccessComponent } from './sso-connection-success.component';

describe('SsoConnectionSuccessComponent', () => {
  let component: SsoConnectionSuccessComponent;
  let fixture: ComponentFixture<SsoConnectionSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SsoConnectionSuccessComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ComponentSwitcherDirective, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoConnectionSuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
