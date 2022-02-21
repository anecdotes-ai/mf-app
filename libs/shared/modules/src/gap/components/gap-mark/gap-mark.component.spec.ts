import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GapMarkComponent } from './gap-mark.component';

describe('GapMarkComponent', () => {
  let component: GapMarkComponent;
  let fixture: ComponentFixture<GapMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GapMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
