import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginCustomStateComponent } from './plugin-custom-state.component';
import { Subject } from 'rxjs';

class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

describe('PluginCustomStateComponent', () => {
  let component: PluginCustomStateComponent;
  let fixture: ComponentFixture<PluginCustomStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginCustomStateComponent],
      providers: [{ provide: ComponentSwitcherDirective, useClass: MockSwitcherDir }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginCustomStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
