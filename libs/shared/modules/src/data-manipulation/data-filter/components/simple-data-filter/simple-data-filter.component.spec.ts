import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleDataFilterComponent } from './simple-data-filter.component';
import { FilterDefinition } from 'core/modules/data-manipulation/data-filter';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

interface TestData {
  someField: string;
  someId: string;
}

@Component({
  selector: 'app-test-component',
  template: ` <app-simple-data-filter
    [filteringDefinition]="filteringDefinition"
    [data]="data"
  ></app-simple-data-filter>`,
})
class TestComponent {
  filteringDefinition: FilterDefinition<TestData>[];
  data: TestData[];
}

describe('SimpleDataFilterComponent', () => {
  configureTestSuite();

  let simpleDataFilterComponent: SimpleDataFilterComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let simpleDataFilterDebugElement: DebugElement;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SimpleDataFilterComponent],
    })
      .overrideComponent(SimpleDataFilterComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    simpleDataFilterDebugElement = fixture.debugElement.query(By.directive(SimpleDataFilterComponent));
    simpleDataFilterComponent = simpleDataFilterDebugElement.componentInstance;
  });

  it('should create', () => {
    expect(simpleDataFilterComponent).toBeTruthy();
  });

  describe('filter fields rendering', () => {
    it('should render the same number of fields as in FilterDefinition array', async () => {
      // Arrange
      const firstFilterDefinition: FilterDefinition<TestData> = {
        fieldId: 'someFieldId',
        propertySelector: (x) => x.someField,
      };

      const secondFilterDefinition: FilterDefinition<TestData> = {
        fieldId: 'someSecondFieldId',
        propertySelector: (x) => x.someId,
      };
      testComponent.filteringDefinition = [firstFilterDefinition, secondFilterDefinition];
      testComponent.data = [
        {
          someField: 'someValue',
          someId: 'someId',
        },
      ];

      // Act
      fixture.detectChanges();

      // Assert
      expect(simpleDataFilterDebugElement.query(By.css(`#${firstFilterDefinition.fieldId}.filter-field`))).toBeTruthy();
      expect(
        simpleDataFilterDebugElement.query(By.css(`#${secondFilterDefinition.fieldId}.filter-field`))
      ).toBeTruthy();
      expect(simpleDataFilterDebugElement.queryAll(By.css('.filter-field')).length).toBe(
        testComponent.filteringDefinition.length
      );
    });

    it('should NOT render fields if FilterDefinition array null', async () => {
      // Arrange
      testComponent.filteringDefinition = null;

      // Act
      fixture.detectChanges();

      // Assert
      expect(simpleDataFilterDebugElement.query(By.css(`.filter-field`))).toBeNull();
    });
  });
});
