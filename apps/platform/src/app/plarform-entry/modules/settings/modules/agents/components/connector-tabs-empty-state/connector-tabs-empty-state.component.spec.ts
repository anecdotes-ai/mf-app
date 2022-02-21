import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorTabsEmptyStateComponent } from './connector-tabs-empty-state.component';

describe('ConnectorTabsEmptyStateComponent', () => {
  let component: ConnectorTabsEmptyStateComponent;
  let fixture: ComponentFixture<ConnectorTabsEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorTabsEmptyStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorTabsEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
