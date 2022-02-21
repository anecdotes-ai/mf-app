import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyStatusComponent } from './policy-status.component';

describe('PolicyStatusComponent', () => {
  let component: PolicyStatusComponent;
  let fixture: ComponentFixture<PolicyStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
