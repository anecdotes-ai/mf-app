import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ThreeDotsMenuComponent } from './three-dots-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { OverlayModule } from '@angular/cdk/overlay';

describe('ThreeDotsMenuComponent', () => {
  configureTestSuite();

  let component: ThreeDotsMenuComponent;
  let fixture: ComponentFixture<ThreeDotsMenuComponent>;
  let spyDirty: jasmine.Spy;
  let spyOpened: jasmine.Spy;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [ThreeDotsMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeDotsMenuComponent);
    component = fixture.componentInstance;

    // Act
    fixture.detectChanges();

    // Arrange
    spyDirty = spyOn(component.dirty, 'emit');
    spyOpened = spyOn(component.opened, 'emit');
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
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
          translationKey: 'requirements.threeDotsMenu.upload',
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
          translationKey: 'requirements.threeDotsMenu.upload',
          displayCondition: (ctx) => false,
        },
        {
          action: jasmine.any,
          translationKey: 'requirements.threeDotsMenu.upload',
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
          translationKey: 'requirements.threeDotsMenu.upload',
          displayCondition: (ctx) => false,
        },
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
