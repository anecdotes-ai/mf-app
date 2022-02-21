/* tslint:disable:no-unused-variable */
import { ChangeDetectionStrategy, Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ControlHeaderComponent } from '../atoms';
import { configureTestSuite } from 'ng-bullet';
import { ControlMockComponent } from 'core/mocks';
import { RadioButtonModel } from 'core/models';
import { MakeProvider } from '../abstract-value-accessor';
import { RadioButtonGroupComponent } from './radio-button-group.component';

@Component({
  selector: 'app-radio-button',
  template: ``,
  providers: [MakeProvider(RadioButtonMockComponent)],
})
class RadioButtonMockComponent extends ControlMockComponent {
  @Output()
  toggled = new EventEmitter();

  @Input()
  value: any;
}

@Component({
  selector: 'app-host',
  template: `
    <form [formGroup]="formGroup">
      <app-radio-button-group [buttons]="buttons" [formControl]="control"></app-radio-button-group>
    </form>
  `,
})
class HostComponent {
  control = new FormControl();
  formGroup = new FormGroup({
    testControl: this.control,
  });

  buttons: RadioButtonModel[];
}

describe('RadioButtonGroupComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;
  let componentUnderTest: RadioButtonGroupComponent;
  const fakeButton: RadioButtonModel = { id: 'first-fake-id', value: {} };
  const secondFakeButton: RadioButtonModel = { id: 'second-fake-id', value: {} };

  function getRadioButtons(): DebugElement[] {
    return fixture.debugElement.queryAll(By.directive(RadioButtonMockComponent));
  }

  function getHeaderComponent(): ControlHeaderComponent {
    return fixture.debugElement.query(By.directive(ControlHeaderComponent))?.componentInstance;
  }

  function getRadioButtonComponents(): RadioButtonMockComponent[] {
    return getRadioButtons().map((x) => x.componentInstance);
  }

  function getFirstRadioButtonComponent(): RadioButtonMockComponent {
    return getRadioButtonComponents()[0];
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), NgbTooltipModule],
      declarations: [RadioButtonGroupComponent, RadioButtonMockComponent, HostComponent, ControlHeaderComponent],
    })
      .overrideComponent(RadioButtonGroupComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(RadioButtonGroupComponent)).componentInstance;
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('control header', () => {
    it('should not be rendered if label does not have value', async () => {
      // Arrange
      componentUnderTest.label = undefined;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(getHeaderComponent()).toBeFalsy();
    });

    it('should be rendered if label has value', async () => {
      // Arrange
      componentUnderTest.label = 'some-label';

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(getHeaderComponent()).toBeInstanceOf(ControlHeaderComponent);
    });

    it('should be provided with required inputs', async () => {
      // Arrange
      componentUnderTest.label = 'some-label';
      componentUnderTest.labelParamsObj = {};
      componentUnderTest.required = true;
      componentUnderTest.index = 123;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(getHeaderComponent().label).toBe(componentUnderTest.label);
      expect(getHeaderComponent().labelParamsObj).toBe(componentUnderTest.labelParamsObj);
      expect(getHeaderComponent().required).toBe(componentUnderTest.required);
      expect(getHeaderComponent().index).toBe(componentUnderTest.index);
    });
  });

  describe('when buttons property is specified', () => {
    beforeEach(async () => {
      hostComponent.buttons = [fakeButton, secondFakeButton];
      fixture.detectChanges();
      await fixture.whenRenderingDone();
    });
  });

  describe('setValue functions', () => {
    beforeEach(async () => {
      hostComponent.buttons = [fakeButton, secondFakeButton];
      fixture.detectChanges();
      await fixture.whenRenderingDone();
    });

    it('should set value for value property', () => {
      // Act
      componentUnderTest.setValue(1);

      // Assert
      expect(componentUnderTest.value).toBe(secondFakeButton.value);
    });
  });

  describe('rendering', () => {
    beforeEach(async () => {
      hostComponent.buttons = [fakeButton, secondFakeButton];
      fixture.detectChanges();
      await fixture.whenRenderingDone();
    });

    it('should render radio buttons according to count', async () => {
      // Assert
      expect(getRadioButtons().length).toBe(hostComponent.buttons.length);
    });

    it('should render radio buttons with id according to button id', async () => {
      // Assert
      expect(getRadioButtons()[0].nativeElement.id).toBe(fakeButton.id);
    });

    describe('when button does not have value property', () => {});
  });

  describe('radio button', () => {
    beforeEach(async () => {
      hostComponent.buttons = [fakeButton, secondFakeButton];
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      spyOn(componentUnderTest, 'setValue');
    });

    it('should call setValue with index when toggled event is emitted', async () => {
      // Act
      getFirstRadioButtonComponent().toggled.emit();

      // Assert
      expect(componentUnderTest.setValue).toHaveBeenCalledWith(0);
    });

    it('should get true value if formControl being bind to radio button group takes value', async () => {
      // Arrange
      hostComponent.control.setValue(fakeButton.value);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(getFirstRadioButtonComponent().value).toBeTrue();
    });

    it('should get false value if another control in group gets true value', async () => {
      // Arrange
      hostComponent.control.setValue(secondFakeButton.value);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(getFirstRadioButtonComponent().value).toBeFalse();
    });
  });
});
