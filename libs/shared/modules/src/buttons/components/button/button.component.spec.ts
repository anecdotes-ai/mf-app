/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { ButtonSize, ButtonType } from '../../types';
import { ButtonNewComponent } from './button.component';

describe('ButtonComponent', () => {
  configureTestSuite();

  let componentUnderTest: ButtonNewComponent;
  let fixture: ComponentFixture<ButtonNewComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonNewComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonNewComponent);
    componentUnderTest = fixture.componentInstance;
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
    it('should be set to medium by default', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.size).toBe('medium');
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

  describe('focused state', () => {
    function assertFocusedState(isFocusedState: boolean): void {
      expect(!!fixture.debugElement.classes['focused']).toBe(isFocusedState);
    }
    
    it('should set "focused" class for host when "focused" input is true', () => {
      // Arrange
      componentUnderTest.focused = true;

      // Act
      fixture.detectChanges();

      // Assert
      assertFocusedState(true);
    });

    it('should not set "focused" class for host when "focused" input is false', () => {
      // Arrange
      componentUnderTest.focused = false;

      // Act
      fixture.detectChanges();

      // Assert
      assertFocusedState(false);
    });
  });
});
