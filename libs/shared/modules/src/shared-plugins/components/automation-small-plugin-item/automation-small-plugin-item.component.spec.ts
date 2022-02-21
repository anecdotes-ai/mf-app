import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Service } from 'core/modules/data/models/domain';
import { PluginService } from 'core/modules/data/services';
import { AutomationSmallPluginItemComponent } from './automation-small-plugin-item.component';
import { Observable, of } from 'rxjs';

class MockPluginService {
  getServiceIconLink(serviceId: string, isLarge = false): Observable<string> {
    return of('mock-icon-path');
  }
}

describe('AutomationSmallPluginItemComponent', () => {
  let component: AutomationSmallPluginItemComponent;
  let fixture: ComponentFixture<AutomationSmallPluginItemComponent>;

  let testPlugin: Service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutomationSmallPluginItemComponent],
      providers: [{ provide: PluginService, useClass: MockPluginService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationSmallPluginItemComponent);
    component = fixture.componentInstance;

    testPlugin = { service_id: 'test_id', service_display_name: 'test_display_name' };
    component.pluginData = testPlugin;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
