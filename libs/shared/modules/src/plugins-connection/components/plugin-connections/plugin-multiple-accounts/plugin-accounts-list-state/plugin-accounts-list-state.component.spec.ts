import { ComponentSwitcherDirective } from './../../../../../component-switcher/directives/component-switcher/component-switcher.directive';
import { PluginConnectionFacadeService } from './../../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginAccountsListStateComponent } from './plugin-accounts-list-state.component';

describe('PluginAccountsListStateComponent', () => {
  let component: PluginAccountsListStateComponent;
  let fixture: ComponentFixture<PluginAccountsListStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ComponentSwitcherDirective, useValue: {} }, { provide: PluginConnectionFacadeService, useValue: {} }],
      declarations: [PluginAccountsListStateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginAccountsListStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
