import { PluginsDataService } from './../../../../services/plugins-data-service/plugins.data.service';
import { PluginConnectionFacadeService } from './../../../../services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginAccountItemComponent } from './plugin-account-item.component';

describe('PluginAccountItemComponent', () => {
  let component: PluginAccountItemComponent;
  let fixture: ComponentFixture<PluginAccountItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: PluginConnectionFacadeService, useValue: {} }, { provide: PluginsDataService, useValue: {} }],
      declarations: [PluginAccountItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginAccountItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
