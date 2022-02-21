import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPluginIconComponent } from './dashboard-plugin-icon.component';
import { PluginService } from 'core/modules/data/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardPluginIconComponent', () => {
  let component: DashboardPluginIconComponent;
  let fixture: ComponentFixture<DashboardPluginIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DashboardPluginIconComponent],
      providers: [{ provide: PluginService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPluginIconComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
