import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuAction } from 'core/modules/dropdown-menu';
import { configureTestSuite } from 'ng-bullet';
import { DropdownOptionComponent } from './dropdown-option.component';

describe('DropdownOptionComponent', () => {
  configureTestSuite();

  let componentUnderTest: DropdownOptionComponent;
  let fixture: ComponentFixture<DropdownOptionComponent>;

  let fakeMenuAction: MenuAction;
  let fakeContext: any;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.detectChanges();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DropdownOptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownOptionComponent);
    componentUnderTest = fixture.componentInstance;
    fakeMenuAction = {};
    fakeContext = {};
    componentUnderTest.menuAction = fakeMenuAction;
    componentUnderTest.context = fakeContext;
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('action', () => {
    it('should be called on host click if specified', async () => {
      // Arrange
      componentUnderTest.context = undefined;
      componentUnderTest.menuAction.action = jasmine.createSpy('action');

      // Act
      await detectChanges();
      fixture.debugElement.triggerEventHandler('click', new MouseEvent('click'));

      // Assert
      expect(fakeMenuAction.action).toHaveBeenCalled();
    });

    it('should be called on host click if specified with context', async () => {
      // Arrange
      fakeMenuAction.action = jasmine.createSpy('action');

      // Act
      await detectChanges();
      fixture.debugElement.triggerEventHandler('click', new MouseEvent('click'));

      // Assert
      expect(fakeMenuAction.action).toHaveBeenCalledWith(fakeContext);
    });
  });

  describe('hidden class', () => {
    it('should be set for host if displayCondition returns false', async () => {
      // Arrange
      componentUnderTest.menuAction.displayCondition = jasmine.createSpy('displayCondition').and.returnValue(false);

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.classes['hidden']).toBeTruthy();
    });

    it('should not be set for host if displayCondition returns true', async () => {
      // Arrange
      componentUnderTest.menuAction.displayCondition = jasmine.createSpy('displayCondition').and.returnValue(true);

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.classes['hidden']).toBeFalsy();
    });

    it('should not be set for host if displayCondition is not specified', async () => {
      // Arrange
      componentUnderTest.menuAction.displayCondition = undefined;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.classes['hidden']).toBeFalsy();
    });
  });

  describe('disabled state', () => {
    function assertDisabledState(isDisabledState: boolean): void {
      expect(!!fixture.debugElement.classes['pointer-events-none']).toEqual(isDisabledState);
      expect(!!fixture.debugElement.classes['opacity-50']).toEqual(isDisabledState);
    }

    it('should be set for host if disabledCondition returns true', async () => {
      // Arrange
      componentUnderTest.menuAction.disabledCondition = jasmine.createSpy('disabledCondition').and.returnValue(true);

      // Act
      await detectChanges();

      // Assert
      assertDisabledState(true);
    });

    it('should not be set for host if displayCondition returns false', async () => {
      // Arrange
      componentUnderTest.menuAction.disabledCondition = jasmine.createSpy('disabledCondition').and.returnValue(false);

      // Act
      await detectChanges();

      // Assert
      assertDisabledState(false);
    });

    it('should not be set for host if disabledCondition is not specified', async () => {
      // Arrange
      componentUnderTest.menuAction.disabledCondition = undefined;

      // Act
      await detectChanges();

      // Assert
      assertDisabledState(false);
    });
  });

  describe('selected state', () => {
    function assertSelectedState(isSelectedState: boolean): void {
      expect(!!fixture.debugElement.classes['bg-navy-30']).toEqual(isSelectedState);
    }

    it('should be set for host if "selected" input is true', async () => {
      // Arrange
      componentUnderTest.selected = true;

      // Act
      await detectChanges();

      // Assert
      assertSelectedState(true);
    });

    it('should not be set for host if "selected" input is false', async () => {
      // Arrange
      componentUnderTest.selected = false;

      // Act
      await detectChanges();

      // Assert
      assertSelectedState(false);
    });
  });
});
