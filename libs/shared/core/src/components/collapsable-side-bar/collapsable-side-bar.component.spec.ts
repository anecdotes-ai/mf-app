import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollapsableSideBarComponent } from './collapsable-side-bar.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CollapsableSideBarComponent', () => {
  let fixture: ComponentFixture<CollapsableSideBarComponent>;
  let component: CollapsableSideBarComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
      declarations: [CollapsableSideBarComponent],
    });

    fixture = TestBed.createComponent(CollapsableSideBarComponent);
    component = fixture.componentInstance;
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
