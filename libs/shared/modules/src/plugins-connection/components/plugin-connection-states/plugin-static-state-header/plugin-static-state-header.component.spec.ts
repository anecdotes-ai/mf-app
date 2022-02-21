import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PluginStaticStateHeaderComponent } from './plugin-static-state-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { Service } from 'core/modules/data/models/domain';

class MockSwitcherDir {
  public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

  goById = jasmine.createSpy('goById');
}

describe('PluginStaticStateHeaderComponent', () => {
  let component: PluginStaticStateHeaderComponent;
  let fixture: ComponentFixture<PluginStaticStateHeaderComponent>;

  const service: Service = {
    service_display_name: 'some-service',
    service_evidence_list: [{}, {}],
    service_type: 'COLLABORATION',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PluginStaticStateHeaderComponent],
      providers: [
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: PluginConnectionFacadeService, useValue: {} }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginStaticStateHeaderComponent);
    component = fixture.componentInstance;
    component.service = service;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
