import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FilterButtonComponent } from './filter-button.component';

describe('FilterButtonComponent', () => {
  let component: FilterButtonComponent;
  let fixture: ComponentFixture<FilterButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FilterButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have type attribute equal to primary`, () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.attributes['type']).toBe('primary');
  });

  it('should have role attribute equal to button', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.attributes['role']).toBe('button');
  });

  it('should have btn class', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['btn']).toBeTruthy();
  });

  it('should have custom-size class', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['custom-size']).toBeTruthy();
  });
});
