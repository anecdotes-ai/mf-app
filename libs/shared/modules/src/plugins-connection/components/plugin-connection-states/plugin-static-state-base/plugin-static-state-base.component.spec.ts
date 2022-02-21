import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginStaticStateBaseComponent } from './plugin-static-state-base.component';
import { Subject } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-plugin-static-state-base-test',
  template: '',
})
export class PluginStaticStateBaseTestComponent extends PluginStaticStateBaseComponent {
  get footerDisplayed(): boolean {
    throw new Error('Method not implemented.');
  }
  get headerDisplayed(): boolean {
    throw new Error('Method not implemented.');
  }
}

class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

describe('PluginStaticStateBaseComponent', () => {
  let component: PluginStaticStateBaseComponent;
  let fixture: ComponentFixture<PluginStaticStateBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginStaticStateBaseComponent],
      providers: [{ provide: ComponentSwitcherDirective, useClass: MockSwitcherDir }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginStaticStateBaseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
