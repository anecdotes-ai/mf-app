import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { ColoredDropdownMenuComponent } from './colored-dropdown-menu.component';

describe('ColoredDropdownMenuComponent', () => {
  configureTestSuite();

  let component: ColoredDropdownMenuComponent;
  let fixture: ComponentFixture<ColoredDropdownMenuComponent>;
  let spyDirty: jasmine.Spy;
  let spyOpened: jasmine.Spy;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ColoredDropdownMenuComponent],
      imports: [NoopAnimationsModule, MatMenuModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoredDropdownMenuComponent);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();

    // Arrange
    spyDirty = spyOn(component.dirty, 'emit');
    spyOpened = spyOn(component.opened, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('menuOpenEventHandler', () => {
    it('should emit `dirty` and `opened` events with param true', async () => {
      // Act
      component.open();

      // Assert
      expect(spyDirty).toHaveBeenCalledWith(true);
      expect(spyOpened).toHaveBeenCalledWith(true);
    });

    it('if menu was opened in second time "dirty" event doesn\'t emit', async () => {
      // Act
      component.open();
      component.open();

      // Assert
      expect(spyDirty).toHaveBeenCalledTimes(1);
    });
  });

  describe('areAllActionsHidden', () => {
    it('should add class hidden if menuActions return displayCondition with value false', async () => {
      // Arrange
      component.menuActions = [
        {
          action: jasmine.any,
          translationKey: 'requirements.threeDotsMenu.upload',
          displayCondition: (ctx) => false,
        },
      ];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('hidden')).toBeTrue();
    });

    it('should NOT add class hidden if menuActions return displayCondition with value true', async () => {
      // Arrange
      component.menuActions = [
        {
          action: jasmine.any,
          translationKey: 'upload',
          displayCondition: (ctx) => true,
        },
      ];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('hidden')).toBeFalse();
    });

    it('should NOT add class hidden if in menuActions one of the displayCondition return false', async () => {
      // Arrange
      component.menuActions = [
        {
          action: jasmine.any,
          translationKey: 'upload',
          displayCondition: (ctx) => false,
        },
        {
          action: jasmine.any,
          translationKey: 'upload',
          displayCondition: (ctx) => true,
        },
      ];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('hidden')).toBeFalse();
    });

    it('should add class hidden if in menuActions has fields displayCondition that return only false', async () => {
      // Arrange
      component.menuActions = [
        {
          action: jasmine.any,
          translationKey: 'upload',
          displayCondition: (ctx) => false,
        },
        {
          action: jasmine.any,
          translationKey: 'upload',
          displayCondition: (ctx) => false,
        },
      ];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('hidden')).toBeTruthy();
    });

    it('should NOT add class hidden if menuActions is underfund', async () => {
      // Arrange
      component.menuActions = undefined;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('hidden')).toBeFalse();
    });
  });
});
