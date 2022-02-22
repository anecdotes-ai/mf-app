import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginPermissionsTabComponent } from './plugin-permissions-tab.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('PluginPermissionsTabComponent', () => {
  let component: PluginPermissionsTabComponent;
  let fixture: ComponentFixture<PluginPermissionsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginPermissionsTabComponent],
      imports: [HttpClientTestingModule, HttpClientModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginPermissionsTabComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
