import { Inject, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MultiselectHostComponent } from './../multiselect-host/multiselect-host.component';
import { MultiselectCheckmarkComponent } from './multiselect-checkmark.component';
import { configureTestSuite } from 'ng-bullet';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxComponent } from 'core/modules/form-controls/components';
import { By } from '@angular/platform-browser';

@Inject({})
export class MultiselectHostMockComponent {
  readonly selectedItemsMap: Map<string, any> = new Map();
  readonly itemsSelection$: BehaviorSubject<Map<string, any>> = new BehaviorSubject(new Map());

  @Input() selectDefinition: (item: any) => any = (item) => item.id;
}

class Item {
  val: string;
  id: string;
}

describe('MultiselectCheckmarkComponent', () => {
  configureTestSuite();
  let componentUnderTest: MultiselectCheckmarkComponent;
  let componentHost: MultiselectHostComponent;
  const someItem: Item = { val: 'val', id: '1' };
  let fixture: ComponentFixture<MultiselectCheckmarkComponent>;

  let checkboxComponent: CheckboxComponent;
  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MultiselectCheckmarkComponent, MultiselectHostComponent, CheckboxComponent],
      providers: [{ provide: MultiselectHostComponent, useClass: MultiselectHostMockComponent }]
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(MultiselectCheckmarkComponent);

    checkboxComponent = fixture.debugElement.query(By.css('app-checkbox')).componentInstance;

    componentUnderTest = fixture.componentInstance;
    componentHost = TestBed.inject(MultiselectHostComponent);
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  it('should inject host component', () => {
    expect(componentHost).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(async () => {
      componentUnderTest.item = someItem;
      componentHost.itemsSelection$.next(componentHost.selectedItemsMap);
    });

    it('should emit valuechanges when new status comes from host', async () => {
      // Arrange
      const previouValue = false;
      componentUnderTest.checkboxValue = previouValue;
      componentHost.selectedItemsMap.set(someItem.id, someItem);
      spyOn(componentUnderTest.valueChange, 'emit');

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.checkboxValue).not.toEqual(previouValue);
      expect(componentUnderTest.valueChange.emit).toHaveBeenCalledWith(!previouValue);
    });

    it('should not emit valuechanges when same status comes from host', async () => {
      // Arrange
      const previouValue = true;

      componentUnderTest.checkboxValue = previouValue;
      componentHost.selectedItemsMap.set(someItem.id, someItem);
      spyOn(componentUnderTest.valueChange, 'emit');

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.checkboxValue).toEqual(previouValue);
      expect(componentUnderTest.valueChange.emit).not.toHaveBeenCalled();
    });

  });

  describe('changeItemSelection', () => {
    it('should call selectItem in multiselect-host with item when the item is selected', async () => {
      // Arrange
      componentHost.selectItem = jasmine.createSpy('selectItem');

      // Act
      componentUnderTest.changeItemSelection(true);

      // Assert
      expect(componentHost.selectItem).toHaveBeenCalledWith(componentUnderTest.item);
    });

    it('should call unselectItem with item when item unselected', async () => {
      // Arrange
      componentHost.unselectItem = jasmine.createSpy('unselectItem');

      // Act
      componentUnderTest.changeItemSelection(false);

      // Assert
      expect(componentHost.unselectItem).toHaveBeenCalledWith(componentUnderTest.item);
    });


    it('should emit valueChange with selected value', async () => {
      // Arrange
      componentUnderTest.valueChange.emit = jasmine.createSpy('emit');
      const selected = true;

      // Act
      componentUnderTest.changeItemSelection(selected);

      // Assert
      expect(componentUnderTest.valueChange.emit).toHaveBeenCalledWith(selected);
    });
  });

  describe('app-checkbox', () => {
    it('should call changeItemSelection when changeValue', async () => {
      // Arrange
      const spy = spyOn(componentUnderTest, 'changeItemSelection');

      // Act
      checkboxComponent.changeValue.emit({ checked: true });

      // Assert
      expect(spy).toHaveBeenCalled();
    });
  });
});
