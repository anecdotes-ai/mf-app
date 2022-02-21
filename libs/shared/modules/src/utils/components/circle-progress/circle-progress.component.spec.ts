import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleProgressComponent } from 'core/modules/utils';
import { CircleProgressOptions } from 'ng-circle-progress';

describe('CircleProgressComponent', () => {
  let component: CircleProgressComponent;
  let fixture: ComponentFixture<CircleProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CircleProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleProgressComponent);
    component = fixture.componentInstance;

    // Spies
    fixture.detectChanges();
  }));

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  describe('Test: setOptions', () => {
    it('should return CircleProgressOptions if progress is 10 and tabicon is "iso"', () => {
      // Arrange
      component.progress = 10;
      component.tabIcon = 'iso';

      // Act
      component.ngOnChanges();

      // Assert
      expect(component.options).toBeDefined();
      expect(component.options).toEqual(jasmine.objectContaining({ ...CircleProgressOptions }));
    });

    it('should set the null value to options if progress is undefined.', () => {
      // Arrange
      component.progress = undefined;

      // Act
      component.ngOnChanges();

      // Assert
      expect(component.options).toBeNull();
    });
  });
});
