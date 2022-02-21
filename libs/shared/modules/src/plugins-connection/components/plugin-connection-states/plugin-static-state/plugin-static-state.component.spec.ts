import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
import { ComponentSwitcherDirective } from '../../../../component-switcher/directives/component-switcher/component-switcher.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginStaticStateComponent } from './plugin-static-state.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFactoryResolver, Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { PluginStaticStateBaseComponent } from '../plugin-static-state-base/plugin-static-state-base.component';

@Directive({
  selector: '[componentsToSwitch]',
  exportAs: 'switcher',
})
class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

describe('PluginStaticStateComponent', () => {
  let component: PluginStaticStateComponent;
  let fixture: ComponentFixture<PluginStaticStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ComponentFactoryResolver, { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir }],
      declarations: [PluginStaticStateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginStaticStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
