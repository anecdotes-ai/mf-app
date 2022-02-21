import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginInfoTabComponent } from './plugin-info-tab.component';
import { PluginService } from 'core/modules/data/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('PluginInfoTabComponent', () => {
  let component: PluginInfoTabComponent;
  let fixture: ComponentFixture<PluginInfoTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginInfoTabComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: PluginService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginInfoTabComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
