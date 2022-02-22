import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TranslateModule } from '@ngx-translate/core';
import { RiskTagDropdownComponent } from './risk-tag-dropdown.component';
import { notSetClass, NOT_SET } from '../../constants';

describe('RiskTagDropdownComponent', () => {
  configureTestSuite();

  let component: RiskTagDropdownComponent;
  let fixture: ComponentFixture<RiskTagDropdownComponent>;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskTagDropdownComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTagDropdownComponent);
    component = fixture.componentInstance;

    component.itemsTranslationKey = 'key';
    component.ratingItems = ['item1', 'item2'];
    component.itemsBGClasses = { [component.ratingItems[0]]: 'class', [component.ratingItems[1]]: 'class' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set menuActions with correct values', async () => {
      // Arrange
      const menuActions = [
        {
          translationKey: 'riskManagement.key.item1',
        },
        {
          translationKey: 'riskManagement.key.item2',
        },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.menuActions.length).toEqual(2);
      expect(component.menuActions.map((action) => action.translationKey)).toEqual(
        menuActions.map((action) => action.translationKey)
      );
    });
  });

  describe('clearSelected', () => {
    it('should set currentValue to default', async () => {
      // Act
      component.clearSelected();

      // Assert
      expect(component.currentValue).toEqual(`riskManagement.${NOT_SET}`);
    });

    it('should set buttonBGClass to default', async () => {
      // Act
      component.clearSelected();

      // Assert
      expect(component.buttonBGClass).toEqual(notSetClass);
    });
  });

  describe('hasValue', () => {
    it('should get correct value when there is a value', async () => {
      // Arrange
      component.currentValue = `riskManagement.item1`;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.hasValue).toEqual(true);
    });

    it('should get correct value when value is the default one', async () => {
      // Arrange
      component.currentValue = `riskManagement.${NOT_SET}`;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.hasValue).toEqual(false);
    });
  });
});
