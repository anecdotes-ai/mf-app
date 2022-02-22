import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RiskEditableFieldComponent } from './risk-editable-field.component';

describe('RiskEditableFieldComponent', () => {
  configureTestSuite();

  let component: RiskEditableFieldComponent;
  let fixture: ComponentFixture<RiskEditableFieldComponent>;

  @Component({
    selector: '[multilineTextWithElipsis]',
    template: `<ng-content></ng-content>`,
    exportAs: 'multilineText',
  })
  class MultilineTextWithElipsisMockComponent {}

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RiskEditableFieldComponent, MultilineTextWithElipsisMockComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskEditableFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('enableEditableMode()', () => {
    it('should set description text to form control', async () => {
      // Arrange
      component.fieldText = 'some-text';

      // Act
      fixture.detectChanges();
      await component.enableEditableMode();

      // Assert
      expect(component.formControl).toBeTruthy();
      expect(component.formControl.value).toEqual('some-text');
    });
  });

  describe('cancelEditing()', () => {
    it('should set form control to null', async () => {
      // Arrange
      component.fieldText = 'some-text';

      // Act
      fixture.detectChanges();
      await component.enableEditableMode();
      component.cancelEditing();

      // Assert
      expect(component.formControl).toBeFalsy();
    });
  });

  describe('displayed components testing', () => {
    it('should display editable-field element if form control is truthy', async () => {
      // Arrange
      component.fieldText = 'some-text';

      // Act
      fixture.detectChanges();
      await component.enableEditableMode();

      // Assert
      expect(fixture.debugElement.query(By.css('.editable-field'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.displayed-text'))).toBeFalsy();
    });

    it('should display displayed-text element if form control is falsy', () => {
      // Arrange
      component.formControl = null;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('.editable-field'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.displayed-text'))).toBeTruthy();
    });
  });

  describe('submitEditing()', () => {
    it('should set new value to textToDisplay', async () => {
      // Arrange
      component.fieldText = 'some-text';
      component.cancelEditing = jasmine.createSpy('cancelEditing');

      // Act
      fixture.detectChanges();
      await component.enableEditableMode();
      component.formControl.setValue('some-value');
      component.submitEditing(new Event('click'));

      // Assert
      expect(component.textToDisplay).toEqual('some-value');
      expect(component.cancelEditing).toHaveBeenCalledWith();
    });
  });

  describe('displayed text testing', () => {
    it('should display placeholder text if descriptionText is falsy', async () => {
      // Arrange
      component.fieldText = '';
      component.placeholder = 'placeholder';

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const element = fixture.debugElement.query(By.css('.displayed-text')).nativeElement;

      // Assert
      expect(element.innerText).toEqual(component.placeholder);
    });
    
    it('should display description text if descriptionText is truthy', async () => {
      // Arrange
      component.fieldText = 'description';
      component.placeholder = 'placeholder';

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const element = fixture.debugElement.query(By.css('.displayed-text')).nativeElement;

      // Assert
      expect(element.innerText).toEqual(component.fieldText);
    });
  });

  describe('textToDisplay', () => {
    it('should set value of descriptionText to textToDisplay prop', async () => {
      // Arrange
      component.fieldText = 'some-text';

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.textToDisplay).toEqual('some-text');
    });
  });

  describe('hasChanges()', () => {
    it('should return false if there are no changes in description field', async () => {
      // Arrange
      component.fieldText = 'some-text';

      // Act
      fixture.detectChanges();
      await component.enableEditableMode();

      // Assert
      expect(component.hasChanges).toBeFalse();
    });

    it('should return true if there are changes in description field', async () => {
      // Arrange
      component.fieldText = 'some-text';

      // Act
      fixture.detectChanges();
      await component.enableEditableMode();
      component.formControl.setValue('new-value');

      // Assert
      expect(component.hasChanges).toBeTrue();
    });
  });
});
