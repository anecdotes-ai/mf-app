import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RadioButtonComponent } from './radio-button.component';

@Component({
  selector: 'app-host',
  template: ` <app-radio-button [allowToggle]="allowToggle" (toggled)="toggled($event)">
    <div class="ng-content"></div>
  </app-radio-button>`,
})
class HostComponent {
  allowToggle: boolean;
  toggled = jasmine.createSpy('toggled');
}

describe('RadioButtonComponent', () => {
  let hostComponent: HostComponent;
  let componentUnderTest: RadioButtonComponent;
  let fixture: ComponentFixture<HostComponent>;

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RadioButtonComponent, HostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(RadioButtonComponent)).componentInstance;
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should have falsy value by default', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(componentUnderTest.value).toBeFalsy();
  });

  describe('chosen class for host', () => {
    const classChosen = 'chosen';

    function getRadioButtonComponentNativeElement(): HTMLElement {
      return fixture.debugElement.query(By.directive(RadioButtonComponent)).nativeElement;
    }

    it('should have chosen class when value is true', async () => {
      // Arrange
      await detectChanges();
      componentUnderTest.value = true;

      // Act
      await detectChanges();

      // Assert
      expect(getRadioButtonComponentNativeElement().classList.contains(classChosen)).toBeTruthy();
    });

    it('should not have chosen class when value is false', async () => {
      // Arrange
      await detectChanges();
      componentUnderTest.value = false;

      // Act
      await detectChanges();

      // Assert
      expect(getRadioButtonComponentNativeElement().classList.contains(classChosen)).toBeFalsy();
    });
  });

  describe('toggle function', () => {
    beforeEach(() => {
      spyOn(componentUnderTest.toggled, 'emit');
    });

    it('should change value to true and emit toggled event', () => {
      // Arrange
      componentUnderTest.value = false;

      // Act
      componentUnderTest.toggle();

      // Assert
      expect(componentUnderTest.value).toBeTrue();
      expect(componentUnderTest.toggled.emit).toHaveBeenCalledWith(true);
    });

    it('should change value to false and emit toggled event', () => {
      // Arrange
      componentUnderTest.value = true;

      // Act
      componentUnderTest.toggle();

      // Assert
      expect(componentUnderTest.value).toBeFalse();
      expect(componentUnderTest.toggled.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('choose function', () => {
    beforeEach(() => {
      spyOn(componentUnderTest.toggled, 'emit');
    });

    it('should change value to true and emit toggled event', () => {
      // Arrange
      componentUnderTest.value = false;

      // Act
      componentUnderTest.choose();

      // Assert
      expect(componentUnderTest.value).toBeTrue();
      expect(componentUnderTest.toggled.emit).toHaveBeenCalledWith(true);
    });

    it('should do nothing if value is already true', () => {
      // Arrange
      componentUnderTest.value = true;

      // Act
      componentUnderTest.choose();

      // Assert
      expect(componentUnderTest.value).toBeTrue();
      expect(componentUnderTest.toggled.emit).not.toHaveBeenCalled();
    });
  });

  describe('radio button wrapper', () => {
    function getRadioButtonComponentNativeElement(): HTMLElement {
      return fixture.debugElement.query(By.directive(RadioButtonComponent)).nativeElement;
    }

    it('should call toggle function if allowToggle is true when click event is triggered', () => {
      // Arrange
      hostComponent.allowToggle = true;
      spyOn(componentUnderTest, 'toggle');

      // Act
      getRadioButtonComponentNativeElement().click();

      // Assert
      expect(componentUnderTest.toggle).toHaveBeenCalled();
    });

    it('should call choose function if allowToggle is false when click event is triggered', () => {
      // Arrange
      hostComponent.allowToggle = false;
      spyOn(componentUnderTest, 'choose');

      // Act
      getRadioButtonComponentNativeElement().click();

      // Assert
      expect(componentUnderTest.choose).toHaveBeenCalled();
    });

    it('should contain "pointer-events-none" class that prevents click', () => {
      // Arrange
      componentUnderTest.disabled = true;

      // Act
      fixture.detectChanges();
      const classes = Object.keys(fixture.debugElement.query(By.css('.disabled')).classes);

      // Assert
      expect(classes).toContain('pointer-events-none');
    });
  });
});
