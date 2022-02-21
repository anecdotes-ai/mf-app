import { Framework } from 'core/modules/data/models/domain';
import { MultiselectingItem } from 'core/models/multiselecting-item.model';
import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiselectableListComponent } from './multiselecting-list.component';
import { configureTestSuite } from 'ng-bullet';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

const itemsToDemonstrate: MultiselectingItem<Framework>[] = [
  {
    translationKey: 'HIPAA',
    icon: `frameworks/790499088`,
  },
  {
    translationKey: 'HIPAA',
    icon: `frameworks/790499088`
  },
  {
    translationKey: 'HIPAA',
    icon: `frameworks/790499088`
  }
];


@Component({
  selector: 'app-host',
  template: `
    <app-multiselectable-list [itemsList]="itemsToDemonstrate" (selectionItemHandler)="select($event)">
    </app-multiselectable-list>
  `,
})
export class HostComponent {

  itemsToDemonstrate: MultiselectingItem<Framework>[] = [];

  select = jasmine.createSpy('select');
}

describe('MultiselectingListComponent', () => {
  configureTestSuite();
  let componentUnderTest: MultiselectableListComponent;
  let fixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;


  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, MultiselectableListComponent],
      imports: [CommonModule, TranslateModule.forRoot()],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(MultiselectableListComponent)).componentInstance;
    hostComponent.itemsToDemonstrate = itemsToDemonstrate;
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getItemDivs(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.item'));
  }

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  describe('selected class', () => {

    it('should not have selected class when item is not selected', async () => {
      // Arrange
      // Act
      // Assert
      expect(getItemDivs().some((item => item.classes['selected']))).toBe(false);
    });

    it('should have selected class when item is selected', async () => {
      // Arrange
      itemsToDemonstrate[0].selected = true;
      componentUnderTest.itemsList = itemsToDemonstrate;

      // Act
      await detectChanges();

      // Assert
      expect(getItemDivs().some((item => item.classes['selected']))).toBe(true);
    });
  });

  describe('selectionItemHandler()', () => {

    it('should emit select with item ', async () => {
      // Arrange
      spyOn(componentUnderTest.select, 'emit');

      // Act
      componentUnderTest.selectionItemHandler(itemsToDemonstrate[0]);
      // Assert
      expect(componentUnderTest.select.emit).toHaveBeenCalledWith(itemsToDemonstrate[0]);
    });


    it('should change item.selected value', async () => {
      // Arrange
      const savedValue = itemsToDemonstrate[0].selected;

      // Act
      componentUnderTest.selectionItemHandler(itemsToDemonstrate[0]);

      // Assert
      expect(itemsToDemonstrate[0].selected).toEqual(!savedValue);
    });
  });


  describe('item click', () => {
    it('should call selectionItemHandler when clicking on element', async () => {
      // Arrange
      await detectChanges();
      const itemsList = getItemDivs();
      spyOn(componentUnderTest, 'selectionItemHandler');

      // Act
      itemsList[0].triggerEventHandler('click', {});

      // Assert
      expect(componentUnderTest.selectionItemHandler).toHaveBeenCalledWith(itemsToDemonstrate[0]);
    });
  });
});
