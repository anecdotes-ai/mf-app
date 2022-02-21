import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInstanceMenuComponent } from './service-instance-menu.component';

describe('ServiceInstanceMenuComponent', () => {
  let component: ServiceInstanceMenuComponent;
  let fixture: ComponentFixture<ServiceInstanceMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceInstanceMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInstanceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
