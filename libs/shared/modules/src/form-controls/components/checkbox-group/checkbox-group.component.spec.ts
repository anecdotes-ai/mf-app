import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxGroupComponent } from './checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxGroupComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`openedPlugin.dynamicForm.${relativeKey}`);
    });
  });

  describe('#groupValueChange', () => {
    it('should correctly set checked value to passed checkbox item', () => {
      // Arrange
      const value = { checked: true };
      const checkboxes = [
        { valueLabel: 'label1', fieldName: 'field1', value: false },
        { valueLabel: 'label2', fieldName: 'field2', value: false },
        { valueLabel: 'label3', fieldName: 'field3', value: false },
      ];
      component.checkboxes = checkboxes;

      // Act
      component.groupValueChange(value, checkboxes[0]);

      // Assert
      expect(checkboxes[0].value).toBeTrue();
    });

    it('should correctly set newValue to component value', () => {
      // Arrange
      const value = { checked: true };
      const checkboxes = [
        { valueLabel: 'label1', fieldName: 'field1', value: false },
        { valueLabel: 'label2', fieldName: 'field2', value: false },
        { valueLabel: 'label3', fieldName: 'field3', value: false },
      ];
      component.checkboxes = checkboxes;

      const newValue = {
        field1: true,
      };

      // Act
      fixture.detectChanges();
      component.groupValueChange(value, checkboxes[0]);

      // Assert
      expect(component.value).toEqual(newValue);
    });
  });
});
