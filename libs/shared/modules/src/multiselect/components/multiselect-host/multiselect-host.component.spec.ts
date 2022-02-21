import { By } from '@angular/platform-browser';
import { CheckboxComponent } from 'core/modules/form-controls/components';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectHostComponent } from './multiselect-host.component';

describe('MultiselectHostComponent', () => {
  configureTestSuite();
  let component: MultiselectHostComponent;
  let fixture: ComponentFixture<MultiselectHostComponent>;

  let items: { id: string, someParam: string }[];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MultiselectHostComponent, CheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectHostComponent);
    component = fixture.componentInstance;

    items = [
      { id: 'testItem1', someParam: 'someParam1' },
      { id: 'testItem2', someParam: 'someParam2' },
      { id: 'testItem3', someParam: 'someParam3' }
    ];
    component.items = items;
    component.selectDefinition = (item: { id: string, someParam: string }) => item.id;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectAll', () => {
    it('should select all items if checkbox value changed to true', async () => {
      // Arrange
      component.itemsSelection$.next = jasmine.createSpy('itemsSelection$.next');
      component.selectAll = jasmine.createSpy('selectAll', component.selectAll).and.callThrough();

      // Act
      const checkBoxSelectAll = fixture.debugElement.query(By.css('#select-all-checkmark')).componentInstance;
      checkBoxSelectAll.toggle();

      // Assert
      expect(component.selectAll).toHaveBeenCalledWith(true);
      expect(component.selectAllCheckmark).toBeTrue();
      expect(component.selectedItemsMap.size).toEqual(component.items.length);
      expect(component.itemsSelection$.next).toHaveBeenCalledWith(component.selectedItemsMap);
    });

    it('should unselect all items if checkbox value changed to false', async () => {
      // Arrange
      // Select all items
      const checkBoxSelectAll = fixture.debugElement.query(By.css('#select-all-checkmark')).componentInstance;
      checkBoxSelectAll.toggle();

      component.itemsSelection$.next = jasmine.createSpy('itemsSelection$.next');
      component.selectAll = jasmine.createSpy('selectAll', component.selectAll).and.callThrough();

      // Act
      // Unselect all items
      checkBoxSelectAll.toggle();

      // Assert
      expect(component.selectAll).toHaveBeenCalledWith(false);
      expect(component.selectAllCheckmark).toBeFalse();
      expect(component.selectedItemsMap.size).toEqual(0);
      expect(component.itemsSelection$.next).toHaveBeenCalledWith(component.selectedItemsMap);
    });
  });

  describe('isMultiselectVisible', () => {
    it('should apply visible css class if there is any selected items', async () => {
      // Arrange
      component.selectItem(items[0]);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.classes['visible']).toBeTrue();
    });

    it('host element should not has class visible', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.selectedItemsMap.size).toBeFalsy();
      expect(fixture.debugElement.classes['visible']).toBeFalsy();
    });
  });

  describe('onKeydownHandler', () => {
    it('should handle Escape button pressed by hiding the modal and reset all selected items', async () => {
      // Arrange
      component.selectAll(true);

      component.selectAll = jasmine.createSpy('selectAll');

      // Act
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'escape' }));

      // Assert
      expect(component.selectAll).toHaveBeenCalledWith(false);
    });
  });

  describe('selectItem', () => {
    it('should set particular item as selected', async () => {
      // Arrange
      component.selectedItemsMap.set = jasmine.createSpy('selectedItemsMap.set');
      component.itemsSelection$.next = jasmine.createSpy('itemsSelection$.next');

      // Act
      component.selectItem(items[0]);

      // Assert
      expect(component.selectedItemsMap.set).toHaveBeenCalledWith(component.selectDefinition(items[0]), items[0]);
      expect(component.itemsSelection$.next).toHaveBeenCalledWith(component.selectedItemsMap);
    });
  });

  describe('selectItem', () => {
    it('should unselect particular item from selected', async () => {
      // Arrange
      component.selectItem(items[0]);

      component.selectedItemsMap.delete = jasmine.createSpy('selectedItemsMap.delete');
      component.itemsSelection$.next = jasmine.createSpy('itemsSelection$.next');

      // Act
      component.unselectItem(items[0]);

      // Assert
      expect(component.selectedItemsMap.delete).toHaveBeenCalledWith(component.selectDefinition(items[0]));
      expect(component.itemsSelection$.next).toHaveBeenCalledWith(component.selectedItemsMap);
    });
  });
});
