import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataSortComponent, SortOrderBy } from './data-sort.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { SortDefinition } from '../../models';
import { NavigationExtras, Params, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

interface TestEntity {
  status: boolean;
  name: string;
}

class MockRouter {
  routerState: {
    snapshot: {
      root: {
        queryParams: Params;
      };
    };
  };

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }

  constructor() {
    this.routerState = { snapshot: { root: { queryParams: {} } } };
  }
}

@Component({
  selector: 'app-host',
  template: `
    <app-data-sort
      [sortDefinitions]="sortDefinitions"
      [data]="data"
      [displayFieldSelector]="displayFieldSelector"
      [changeQueryParams]="changeQueryParams"
      (sort)="sortFunc($event)"
      ></app-data-sort>
  `
})
class HostComponent {
  sortDefinitions: SortDefinition<any>[] = [];
  data: any[];
  displayFieldSelector = true;
  changeQueryParams = true;
  sortFunc = jasmine.createSpy('sortFunc');
}

describe('DataSortComponent', () => {
  configureTestSuite();
  let componentUnderTest: DataSortComponent;
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  let sortDefinitionInput: SortDefinition<TestEntity>[];
  let sortDataInput: TestEntity[];

  let router: MockRouter;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatMenuModule, RouterTestingModule],
      providers: [{ provide: Router, useClass: MockRouter }, TranslateService],
      declarations: [HostComponent, DataSortComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    sortDefinitionInput = [
      {
        id: 'name',
        translationKey: 'testNameKey',
        propertySelector: (c) => c.name,
      },
      {
        translationKey: 'testStatusKey',
        id: 'status',
        propertySelector: (c) => c.status,
      },
    ];
    sortDataInput = [
      {
        name: 'FirstName',
        status: true,
      },
      {
        name: 'SecondName',
        status: true,
      },
      {
        name: 'ThirdName',
        status: false,
      },
    ];

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(DataSortComponent)).componentInstance;
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('changeQueryParams input', () => {
    it('should be true by default.', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.changeQueryParams).toBeTrue();
    });
  });

  describe('displayFieldSelector input', () => {
    it('should be true by default', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.displayFieldSelector).toBeTrue();
    });

    it('should display field selector if true', () => {
      // Arrange
      hostComponent.displayFieldSelector = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('app-dropdown-control'))).toBeTruthy();
    });

    it('should remove field selector if false', () => {
      // Arrange
      hostComponent.displayFieldSelector = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('app-dropdown-control'))).toBeFalsy();
    });
  });

  describe('#ngOnChanges', () => {
    it('should set selectedItem property and call selectSort method when all data provided', async () => {
      // Arrange
      hostComponent.data = sortDataInput;
      hostComponent.sortDefinitions = sortDefinitionInput;

      spyOn(componentUnderTest, 'selectSort');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(componentUnderTest.selectedItem).toBe(sortDefinitionInput[0]);
      expect(componentUnderTest.selectedItem).toBeTruthy();
      expect(componentUnderTest.selectSort).toHaveBeenCalledWith(componentUnderTest.selectedItem);
    });
  });

  describe('#ngOnInit', () => {
    it('should sort elements if sortedBy route param defined and matches with any provided sortDefinition', async () => {
      // Arrange
      router.routerState.snapshot.root.queryParams = { sortedBy: 'name' };

      hostComponent.sortDefinitions = sortDefinitionInput;

      spyOn(componentUnderTest, 'selectSort');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(componentUnderTest.selectSort).toHaveBeenCalledWith(sortDefinitionInput.find((def) => def.id === 'name'));
    });
  });

  describe('#selectSort', () => {
    it('should add sortedBy query param and emit sorted value', async () => {
      // Arrange
      spyOn(router, 'navigate');
      spyOn(componentUnderTest.sort, 'emit');
      componentUnderTest.data = sortDataInput;

      const selectedDef = sortDefinitionInput[0];
      componentUnderTest.data = sortDataInput;
  
      // Act
      componentUnderTest.selectSort(selectedDef);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: jasmine.objectContaining({ sortedBy: selectedDef.id }),
      });
      expect(componentUnderTest.selectedItem).toEqual(selectedDef);
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith(jasmine.arrayContaining(sortDataInput));
    });

    it(`should reverse values when selectedOrderBy is ${SortOrderBy.DESC}`, async () => {
      // Arrange
      spyOn(componentUnderTest.sort, 'emit');
      hostComponent.data = sortDataInput;
      componentUnderTest.selectedOrderBy = SortOrderBy.DESC;
      const reversedValue = sortDataInput.slice().reverse();
      const selectedDef = sortDefinitionInput[0];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      componentUnderTest.selectSort(selectedDef);

      // Assert
      expect(componentUnderTest.dataToMakeOperations).toEqual(reversedValue);
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith(reversedValue);
      expect(componentUnderTest.selectedOrderBy).toBe(SortOrderBy.DESC);
    });

    it(`should emit empty array if no data provided when sorting`, async () => {
      // Arrange
      spyOn(componentUnderTest.sort, 'emit');
      hostComponent.data = null;

      const selectedDef = sortDefinitionInput[0];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      componentUnderTest.selectSort(selectedDef);

      // Assert
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('#changeDirection', () => {
    it('should emit reversed passed value', async () => {
      // Arrange
      spyOn(componentUnderTest.sort, 'emit');
      hostComponent.data = sortDataInput;
      const reversedValue = sortDataInput.slice().reverse();
      componentUnderTest.selectedItem = sortDefinitionInput[0];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      componentUnderTest.changeDirection();

      // Assert
      expect(componentUnderTest.dataToMakeOperations).toEqual(reversedValue);
      expect(componentUnderTest.sort.emit).toHaveBeenCalledWith(reversedValue);
      expect(componentUnderTest.selectedOrderBy).toBe(SortOrderBy.DESC);
    });
  });

  // describe('#changeDirection', () => {
  //   it('should emit reversed value', async () => {
  //     // Arrange
  //     spyOn(component.reverseSortData, 'emit');
  //     component.data = sortDataInput;

  //     const reversedValue = sortDataInput.reverse();

  //     // Act
  //     component.changeDirection();

  //     // Assert
  //     expect(component.reverseSortData.emit).toHaveBeenCalledWith(jasmine.arrayContaining(reversedValue));
  //   });
  // });
});
