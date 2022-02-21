/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ControlPlaceholderComponent } from './control-placeholder.component';

describe('ControlPlaceholderComponent', () => {
  let componentUnderTest: ControlPlaceholderComponent;
  let fixture: ComponentFixture<ControlPlaceholderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPlaceholderComponent);
    componentUnderTest = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('isTextPlaceholderType function', () => {
    it('should return true if placeholderObj contains type string', () => {
      // Arrange
      componentUnderTest.placeholderObj = { type: 'string', value: 'any' };

      // Act
      const actual = componentUnderTest.isTextPlaceholderType();

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false if placeholderObj doesn not contain type string', () => {
      // Arrange
      componentUnderTest.placeholderObj = { type: 'any', value: 'any' };

      // Act
      const actual = componentUnderTest.isTextPlaceholderType();

      // Assert
      expect(actual).toBeFalsy();
    });
  });
});
