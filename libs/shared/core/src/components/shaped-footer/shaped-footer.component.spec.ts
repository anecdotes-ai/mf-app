import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapedFooterComponent } from './shaped-footer.component';

describe('ShapedFooterComponent', () => {
  let component: ShapedFooterComponent;
  let fixture: ComponentFixture<ShapedFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShapedFooterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapedFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
