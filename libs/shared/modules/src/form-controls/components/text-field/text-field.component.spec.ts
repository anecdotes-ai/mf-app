import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { Component, DebugElement, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { CharactersCounterComponent, ControlHeaderComponent, ControlPlaceholderComponent } from '../atoms';
import { TextFieldComponent } from './text-field.component';

@Component({
  selector: 'app-host',
  template: `
    <form [formGroup]="formGroup">
      <app-text-field
        [id]="idForTextField"
        [formControlName]="'testControl'"
        [maxLength]="maxLength"
        [minLength]="minLength"
        [minValue]="minValue"
        [maxValue]="maxValue"
        [inputType]="inputType"
        [errorTexts]="errorTexts"
        [label]="label"
        [labelParamsObj]="labelParamsObj"
        [required]="required"
        [placeholder]="placeholder"
        [placeholderParamsObj]="placeholderParamsObj"
        [tooltipText]="tooltipText"
        [validateOnDirty]="validateOnDirty"
        [index]="index"
        [removable]="removable"
        [showHideText]="showHideText"
        [readonly]="readonly"
        [displayCharactersCounter]="displayCharactersCounter"
        [clearButtonEnabled]="clearButtonEnabled"
        (input)="input($event)"
        (valueChanges)="valueChanges($event)"
      ></app-text-field>
    </form>
  `,
})
class HostComponent {
  control = new FormControl();
  formGroup = new FormGroup({
    testControl: this.control,
  });

  idForTextField: string;
  maxLength: number;
  minLength: number;
  minValue: number;
  maxValue: number;
  inputType;
  errorTexts: { [key: string]: string | (() => string) };
  label: string;
  labelParamsObj: any;
  required: boolean;
  placeholder: string | TemplateRef<any>;
  placeholderParamsObj: any;
  tooltipText: string;
  validateOnDirty = false;
  index: number;
  removable: boolean;
  showHideText: boolean;
  readonly: boolean;
  displayCharactersCounter: boolean;
  clearButtonEnabled: boolean;
  input = jasmine.createSpy('input');
  valueChanges = jasmine.createSpy('valueChanges');
}

describe('TextFieldComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let componentUnderTest: TextFieldComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule],
      declarations: [HostComponent, TextFieldComponent, ControlHeaderComponent, ControlPlaceholderComponent, CharactersCounterComponent],
      providers: [],
    }).compileComponents();
  }));

  function getTextfieldDebugElement(): DebugElement {
    return fixture.debugElement.query(By.directive(TextFieldComponent));
  }

  function getTextfieldNativeElement(): HTMLElement {
    return getTextfieldDebugElement().nativeElement;
  }

  function getInputNativeElement(type?: string): HTMLInputElement {
    if (type) {
      return fixture.debugElement.query(By.css(`input[type=${type}]`))?.nativeElement;
    }

    return fixture.debugElement.query(By.css(`input`))?.nativeElement;
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(TextFieldComponent)).componentInstance;
    await detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('characters counter', () => {
    const fakeMaxLength = 5;

    beforeEach(() => {
      hostComponent.maxLength = fakeMaxLength;
      hostComponent.displayCharactersCounter = true;
    });

    function getCharactersCounterDebugElement(): DebugElement {
      return getTextfieldDebugElement().query(By.directive(CharactersCounterComponent));
    }

    it('should not be rendered if displayCharactersCounter is false', async () => {
      // Arrange
      hostComponent.displayCharactersCounter = false;

      // Act
      await detectChanges();

      // Assert
      expect(getCharactersCounterDebugElement()).toBeFalsy();
    });

    it('should be rendered if displayCharactersCounter is true', async () => {
      // Arrange
      hostComponent.displayCharactersCounter = true;

      // Act
      await detectChanges();

      // Assert
      expect(getCharactersCounterDebugElement()).toBeTruthy();
    });
  });

  describe('inputBlur function', () => {
    it('should call markAsDirty function', () => {
      // Arrange
      spyOn(componentUnderTest, 'markAsDirty');

      // Act
      componentUnderTest.inputBlur();

      // Assert
      expect(componentUnderTest.markAsDirty).toHaveBeenCalled();
    });
  });

  describe('inputFocusIn function', () => {
    it('should set class active for host element', async () => {
      // Act
      componentUnderTest.inputFocusIn();
      await detectChanges();

      // Assert
      expect(getTextfieldNativeElement().classList.contains('active')).toBeTruthy();
    });

    it('should set isActive to true', async () => {
      // Act
      componentUnderTest.inputFocusIn();
      await detectChanges();

      // Assert
      expect(componentUnderTest.isActive).toBeTruthy();
    });
  });

  describe('inputFocusOut function', () => {
    it('should remove class active from host element', async () => {
      // Arrange
      getTextfieldNativeElement().classList.add('active');

      // Act
      componentUnderTest.inputFocusOut();
      await detectChanges();

      // Assert
      expect(getTextfieldNativeElement().classList.contains('active')).toBeFalsy();
    });

    it('should set isActive to false', async () => {
      // Act
      componentUnderTest.inputFocusOut();
      await detectChanges();

      // Assert
      expect(componentUnderTest.isActive).toBeFalse();
    });
  });

  describe('focusin event', () => {
    it('should call inputFocusIn function', () => {
      // Arrange
      spyOn(componentUnderTest, 'inputFocusIn');

      // Act
      getInputNativeElement().dispatchEvent(new FocusEvent('focusin'));

      // Assert
      expect(componentUnderTest.inputFocusIn).toHaveBeenCalled();
    });
  });

  describe('focusout event', () => {
    it('should call inputFocusOut function', () => {
      // Arrange
      spyOn(componentUnderTest, 'inputFocusOut');

      // Act
      getInputNativeElement().dispatchEvent(new FocusEvent('focusout'));

      // Assert
      expect(componentUnderTest.inputFocusOut).toHaveBeenCalled();
    });
  });

  describe('blur event', () => {
    it('should call inputBlur function', () => {
      // Arrange
      spyOn(componentUnderTest, 'inputBlur');

      // Act
      getInputNativeElement().dispatchEvent(new FocusEvent('blur'));

      // Assert
      expect(componentUnderTest.inputBlur).toHaveBeenCalled();
    });
  });

  it('should render input', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(getInputNativeElement()).toBeTruthy();
  });

  describe('`input` output', () => {
    it('should be emitted when input element changes value', (done) => {
      const inputEvent = new InputEvent('input');

      componentUnderTest.input.subscribe((v) => {
        expect(v).toBe(inputEvent);
        done();
      });

      getInputNativeElement().dispatchEvent(inputEvent);
    });
  });

  describe('inputType property', () => {
    it('should set "text" for "type" attribute', async () => {
      // Arrange
      hostComponent.inputType = 'text';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement(hostComponent.inputType)).toBeTruthy();
    });

    it('should set "number" for "type" attribute', async () => {
      // Arrange
      hostComponent.inputType = 'number';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement(hostComponent.inputType)).toBeTruthy();
    });

    it('should set "password" for "type" attribute', async () => {
      // Arrange
      hostComponent.inputType = 'password';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement(hostComponent.inputType)).toBeTruthy();
    });
  });

  describe('toggleShowHide function', () => {
    it('should change input type from password to text', async () => {
      // Arrange
      hostComponent.inputType = 'password';

      // Act
      await detectChanges();
      componentUnderTest.toggleShowHide();

      // Assert
      expect(getInputNativeElement().type).toBe('text');
    });

    it('should change input type from text to password', async () => {
      // Arrange
      hostComponent.inputType = 'text';

      // Act
      await detectChanges();
      componentUnderTest.toggleShowHide();

      // Assert
      expect(getInputNativeElement().type).toBe('password');
    });
  });

  describe('focus function', () => {
    it('should focus input element', async () => {
      // Act
      await detectChanges();
      const input = getInputNativeElement();
      spyOn(input, 'focus');
      componentUnderTest.focus();

      // Assert
      expect(input.focus).toHaveBeenCalled();
    });
  });

  describe('maxLength property', () => {
    it('should set "maxlength" attribute in accordance with this prop', async () => {
      // Arrange
      const expected = 1234;
      hostComponent.maxLength = expected;

      // Act
      await detectChanges();
      const attr = getInputNativeElement().attributes.getNamedItem('maxlength');

      // Assert
      expect(attr).toBeTruthy();
      expect(attr.value).toBe(expected.toString());
    });
  });

  describe('minValue property', () => {
    it('should set "min" attribute in accordance with this prop', async () => {
      // Arrange
      const expected = 1234;
      hostComponent.minValue = expected;

      // Act
      await detectChanges();
      const attr = getInputNativeElement().attributes.getNamedItem('min');

      // Assert
      expect(attr).toBeTruthy();
      expect(attr.value).toBe(expected.toString());
    });
  });

  describe('maxValue property', () => {
    it('should set "max" attribute in accordance with this prop', async () => {
      // Arrange
      const expected = 1234;
      hostComponent.maxValue = expected;

      // Act
      await detectChanges();
      const attr = getInputNativeElement().attributes.getNamedItem('max');

      // Assert
      expect(attr).toBeTruthy();
      expect(attr.value).toBe(expected.toString());
    });
  });

  describe('when id of host element is specified', () => {
    it('should set id for input', async () => {
      // Arrange
      hostComponent.idForTextField = 'fake-id';

      // Act
      await detectChanges();

      // Assert
      expect(getInputNativeElement().id).toBe(`${hostComponent.idForTextField}-textfield`);
    });
  });

  describe('clear functionality', () => {
    describe('clear button', () => {
      function getClearButton(): DebugElement {
        return fixture.debugElement.query(By.css('app-clear-button'));
      }

      beforeEach(() => {
        hostComponent.clearButtonEnabled = true;
      });

      it('should be displayed when value exists and clear button enabled', async () => {
        // Arrange
        componentUnderTest.value = 'some value';

        // Act
        await detectChanges();

        // Assert
        expect(getClearButton()).toBeTruthy();
      });

      it('should not be displayed when value exists and clear button disabled', async () => {
        // Arrange
        hostComponent.clearButtonEnabled = false;
        componentUnderTest.value = 'some value';

        // Act
        await detectChanges();

        // Assert
        expect(getClearButton()).toBeFalsy();
      });

      it('should not be displayed when value is empty and clear button enabled', async () => {
        // Arrange
        componentUnderTest.value = '';

        // Act
        await detectChanges();

        // Assert
        expect(getClearButton()).toBeFalsy();
      });
    });

    describe('clear()', () => {
      it('should set empty string for value of input', async () => {
        // Arrange
        await detectChanges();
        getInputNativeElement().value = 'some not empty string';

        // Act
        await detectChanges();
        componentUnderTest.clear();

        // Assert
        expect(getInputNativeElement().value).toBe('');
      });

      it('should set empty string for value of component', async () => {
        // Arrange
        await detectChanges();
        componentUnderTest.value = 'some not empty string';

        // Act
        await detectChanges();
        componentUnderTest.clear();

        // Assert
        expect(componentUnderTest.value).toBe('');
      });

      it('should emit valueChanges event', async () => {
        // Arrange
        // Act
        await detectChanges();
        componentUnderTest.clear();

        // Assert
        expect(hostComponent.valueChanges).toHaveBeenCalled();
      });
    });
  });
});
