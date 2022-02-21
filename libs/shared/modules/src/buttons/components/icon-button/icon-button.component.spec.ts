import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { ButtonSize, ButtonType } from '../../types';
import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  configureTestSuite();

  let componentUnderTest: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [IconButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconButtonComponent);
    componentUnderTest = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('type input', () => {
    it('should be set to primary by default', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.type).toBe('primary');
    });

    (['primary', 'secondary'] as ButtonType[]).forEach((type) => {
      it(`should have type attribute equal to ${type}`, () => {
        // Arrange
        componentUnderTest.type = type;

        // Act
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.attributes['type']).toBe(type);
      });
    });
  });

  describe('size input', () => {
    it('should be set to small by default', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.size).toBe('small');
    });

    (['medium', 'small', 'stretch', 'responsive'] as ButtonSize[]).forEach((size) => {
      it(`should have '${size}' class`, () => {
        // Arrange
        componentUnderTest.size = size;

        // Act
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.classes[size]).toBeTruthy();
      });
    });
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

  it('should have disabled class when disabled input is true', () => {
    // Arrange
    componentUnderTest.disabled = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['disabled']).toBeTruthy();
  });

  it('should not have disabled class when disabled input is false', () => {
    // Arrange
    componentUnderTest.disabled = false;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['disabled']).toBeFalsy();
  });
});
