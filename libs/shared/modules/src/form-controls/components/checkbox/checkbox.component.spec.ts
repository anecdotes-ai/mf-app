import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ControlHeaderComponent } from '../atoms';
import { configureTestSuite } from 'ng-bullet';
import { CheckboxComponent } from './checkbox.component';

@Component({
  selector: 'app-host',
  template: `
    <app-checkbox
      [label]="label"
      [valueLabel]="valueLabel"
      [index]="index"
      [required]="required"
      (changeValue)="changeValue($event)"
    >
      <div class="ng-content"></div>
    </app-checkbox>
  `,
})
class HostComponent {
  label: string;
  valueLabel: string;
  index: number;
  required: boolean;
  changeValue = jasmine.createSpy('changeValue');
}

describe('CheckboxComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let componentUnderTest: CheckboxComponent;
  let fixture: ComponentFixture<HostComponent>;

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgbTooltipModule],
      declarations: [CheckboxComponent, ControlHeaderComponent, HostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(CheckboxComponent)).componentInstance;
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  describe('checked class for host', () => {
    const classChecked = 'checked';

    function getCheckBoxComponentNativeElement(): HTMLElement {
      return fixture.debugElement.query(By.directive(CheckboxComponent)).nativeElement;
    }

    it('should have checked class when value is true', async () => {
      // Arrange
      componentUnderTest.value = true;

      // Act
      await detectChanges();

      // Assert
      expect(getCheckBoxComponentNativeElement().classList.contains(classChecked)).toBeTruthy();
    });

    it('should not have checked class when value is false', async () => {
      // Arrange
      componentUnderTest.value = false;

      // Act
      await detectChanges();

      // Assert
      expect(getCheckBoxComponentNativeElement().classList.contains(classChecked)).toBeFalsy();
    });
  });

  describe('header component', () => {
    function getHeaderComponent(): ControlHeaderComponent {
      return fixture.debugElement.query(By.directive(ControlHeaderComponent))?.componentInstance;
    }

    it('should have control header when label is specified', async () => {
      // Arrange
      hostComponent.label = 'someLabel';

      // Act
      await detectChanges();

      // Assert
      expect(getHeaderComponent()).toBeTruthy();
    });

    it('should not have control header when label is not specified', async () => {
      // Arrange
      hostComponent.label = null;

      // Act
      await detectChanges();

      // Assert
      expect(getHeaderComponent()).toBeFalsy();
    });

    it('should have control headers inputs filled', async () => {
      // Arrange
      hostComponent.index = 123;
      hostComponent.label = 'someLabel';
      hostComponent.required = true;

      // Act
      await detectChanges();

      // Assert
      expect(getHeaderComponent().index).toBe(123);
      expect(getHeaderComponent().label).toBe('someLabel');
      expect(getHeaderComponent().required).toBeTrue();
    });
  });

  describe('toggle function', () => {
    it('should change value of control', () => {
      // Arrange
      componentUnderTest.value = false;

      // Act
      componentUnderTest.toggle();

      // Assert
      expect(componentUnderTest.value).toBeTrue();
    });

    it('should emit change value event', () => {
      // Arrange
      componentUnderTest.value = false;
      spyOn(componentUnderTest.changeValue, 'emit');

      // Act
      componentUnderTest.toggle();

      // Assert
      expect(componentUnderTest.changeValue.emit).toHaveBeenCalledWith({ checked: true });
    });
  });

  describe('writeValue function', () => {
    it('should change value of control', () => {
      // Arrange
      componentUnderTest.value = false;

      // Act
      componentUnderTest.writeValue(true);

      // Assert
      expect(componentUnderTest.value).toBeTrue();
    });

    it('should emit change value event', () => {
      // Arrange
      componentUnderTest.value = false;
      spyOn(componentUnderTest.changeValue, 'emit');

      // Act
      componentUnderTest.writeValue(true);

      // Assert
      expect(componentUnderTest.changeValue.emit).toHaveBeenCalledWith({ checked: true });
    });
  });

  describe('check-box-icon element', () => {
    function getCheckBoxIcon(): HTMLElement {
      return fixture.debugElement.query(By.css('div.check-box-icon'))?.nativeElement;
    }

    it('should be rendered', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(getCheckBoxIcon()).toBeTruthy();
    });

    it('should call toggle function when click event is dispatched', async () => {
      // Arrange
      spyOn(componentUnderTest, 'toggle');

      // Act
      await detectChanges();
      getCheckBoxIcon().dispatchEvent(new MouseEvent('click'));

      // Assert
      expect(componentUnderTest.toggle).toHaveBeenCalled();
    });
  });

  describe('valueLabel input', () => {
    it('should render ng-content when the property is not specified', async () => {
      // Arrange
      hostComponent.valueLabel = undefined;

      // Act
      await detectChanges();
      const ngContentElement: HTMLElement = fixture.debugElement.query(By.css('div.ng-content'))?.nativeElement;

      // Assert
      expect(ngContentElement).toBeTruthy();
    });

    it('should render label based on valueLabel', async () => {
      // Arrange
      hostComponent.valueLabel = 'someValueLabel';

      // Act
      await detectChanges();
      const labelTextElement: HTMLElement = fixture.debugElement.query(By.css('span.label-text'))?.nativeElement;

      // Assert
      expect(labelTextElement).toBeTruthy();
      expect(labelTextElement.innerText).toBe(hostComponent.valueLabel);
    });
  });
});
