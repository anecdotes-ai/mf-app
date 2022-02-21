// import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormControl, FormGroup } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { configureTestSuite } from 'ng-bullet';
// import { mapTo, shareReplay, take } from 'rxjs/operators';
// import { FilterDefinition } from '../../models';
// import { distinct } from '../../utils';
// import { DataFilterComponent } from './data-filter.component';

// interface TestData {
//   someField: string;
//   someId: string;
// }

// @Component({
//   selector: 'app-test-component',
//   template: `<app-data-filter [filteringDefinition]="filteringDefinition" [data]="data"></app-data-filter>`,
// })
// class TestComponent {
//   filteringDefinition: FilterDefinition<TestData>[];

//   data: TestData[];
// }

// describe('DataFilterComponent', () => {
//   configureTestSuite();

//   let dataFilterComponent: DataFilterComponent;
//   let testComponent: TestComponent;
//   let fixture: ComponentFixture<TestComponent>;
//   let dataFilterDebugElement: DebugElement;

//   beforeAll(async(() => {
//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot(), NoopAnimationsModule, RouterTestingModule],
//       declarations: [TestComponent, DataFilterComponent],
//       providers: [],
//     })
//       .overrideComponent(DataFilterComponent, {
//         set: { changeDetection: ChangeDetectionStrategy.Default },
//       })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(TestComponent);
//     testComponent = fixture.componentInstance;
//     dataFilterDebugElement = fixture.debugElement.query(By.directive(DataFilterComponent));
//     dataFilterComponent = dataFilterDebugElement.componentInstance;
//   });

//   it('should create', () => {
//     expect(dataFilterComponent).toBeTruthy();
//   });

//   describe('filter fields rendering', () => {
//     it('should render the same number of fields as in filterDefintion', async () => {
//       // Arrange
//       const firstFilterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const secondFilterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someSecondId',
//         propertySelector: (x) => x.someId,
//       };

//       testComponent.filteringDefinition = [firstFilterDefinition, secondFilterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//       ];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(dataFilterDebugElement.query(By.css(`#${firstFilterDefinition.fieldId}.filter-field`))).toBeTruthy();
//       expect(dataFilterDebugElement.query(By.css(`#${secondFilterDefinition.fieldId}.filter-field`))).toBeTruthy();
//       expect(dataFilterDebugElement.queryAll(By.css('.filter-field')).length).toBe(
//         testComponent.filteringDefinition.length
//       );
//     });
//   });

//   describe('buildTranslationKey', () => {
//     it('should return translationKey based on relativeKey', () => {
//       // Arrange
//       const relativeKey = 'someRelativeKey';

//       // Act
//       const actual = dataFilterComponent.buildTranslationKey(relativeKey);

//       // Assert
//       expect(actual).toBe(`core.dataFilter.${relativeKey}`);
//     });
//   });

//   describe('expandComponent()', () => {
//     it('should set true for `expanded` property', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.expandComponent();

//       // Assert
//       expect(dataFilterComponent.expanded).toBeTrue();
//     });

//     it('should set false for `collapsed` property', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.expandComponent();

//       // Assert
//       expect(dataFilterComponent.collapsed).toBeFalse();
//     });

//     it('should emit `expand` event', async () => {
//       // Arrange
//       const expandPromise = dataFilterComponent.expand.pipe(mapTo(true), take(1), shareReplay()).toPromise();

//       // Act
//       dataFilterComponent.expandComponent();

//       // Assert
//       expect(await expandPromise).toBeTrue();
//     });

//     it('should assign `expanded` class for data filter element', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(Object.keys(dataFilterDebugElement.classes)).toContain('expanded');
//     });

//     it('should remove `collapsed` class from data filter element', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(Object.keys(dataFilterDebugElement.classes)).not.toContain('collapsed');
//     });

//     // tslint:disable-next-line: max-line-length
//     it('should set `true` as default value for `displayed` property of filterDefiniton if it is not specified in `builtFilteringDefinition`', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         displayed: undefined,
//         propertySelector: (x) => x.someField,
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//       ];
//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(dataFilterComponent.builtFilteringDefinition[0].displayed).toBeTrue();
//     });

//     it('should keep value of `displayed` property of filterDefiniton if it is specified in `builtFilteringDefinition`', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         displayed: false,
//         propertySelector: (x) => x.someField,
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//       ];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(dataFilterComponent.builtFilteringDefinition[0].displayed).toBeFalse();
//     });

//     it('should set true for `initialized` property', async () => {
//       // Arrange
//       // Act
//       dataFilterComponent.expandComponent();

//       // Assert
//       expect(dataFilterComponent.initialized).toBeTrue();
//     });

//     it('should build filter-definition', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(dataFilterComponent.builtFilteringDefinition).toEqual(testComponent.filteringDefinition);
//     });

//     it('should check option if it is not checked', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent({
//         fieldId: filterDefinition.fieldId,
//         value: filterDefinition.propertySelector(dataObject),
//       });
//       fixture.detectChanges();

//       const fieldControl = dataFilterComponent.formGroup.controls[filterDefinition.fieldId] as FormGroup;

//       const optionControl = fieldControl.controls[filterDefinition.propertySelector(dataObject)];

//       // Assert
//       expect(optionControl.value).toBeTruthy();
//     });

//     it('should sort options in `builtFilterDefinition` if fieldDefinition has `useSort = true`', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         useSort: true,
//         propertySelector: (x) => x.someField,
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'x',
//           someId: 'someId',
//         },
//         {
//           someField: 'a',
//           someId: 'someId',
//         },
//         {
//           someField: 'c',
//           someId: 'someId',
//         },
//         {
//           someField: 'b',
//           someId: 'someId',
//         },
//       ];

//       const sortedData = testComponent.data.map((x) => filterDefinition.propertySelector(x)).sort();

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(sortedData).toEqual(dataFilterComponent.builtFilteringDefinition[0].options.map((x) => x.value));
//     });

//     it('should emit `filteringOptions` with options that was toggled', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];
//       const filteringEventPromise = dataFilterComponent.filteringOptions.pipe(shareReplay(), take(1)).toPromise();

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent({
//         fieldId: filterDefinition.fieldId,
//         value: filterDefinition.propertySelector(dataObject),
//       });
//       fixture.detectChanges();

//       // Assert
//       expect(await filteringEventPromise).toEqual({
//         someFieldId: {
//           someValue: {
//             value: 'someValue',
//             optionId: 'someValue',
//             checked: true,
//             displayed: true,
//             exactValue: 'someValue',
//           },
//         },
//       });
//     });

//     it('should create `fieldId` formGroup with options controls inside component FormGroup', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(dataFilterComponent.formGroup.controls[filterDefinition.fieldId]).toBeInstanceOf(FormGroup);
//       expect(
//         (dataFilterComponent.formGroup.controls[filterDefinition.fieldId] as FormGroup).controls[
//           filterDefinition.propertySelector(dataObject)
//         ]
//       ).toBeInstanceOf(FormControl);
//     });
//   });

//   describe('collapseComponent()', () => {
//     it('should set true for `collapsed` property', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.collapseComponent();

//       // Assert
//       expect(dataFilterComponent.collapsed).toBeTrue();
//     });

//     it('should set false `expanded` property', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.collapseComponent();

//       // Assert
//       expect(dataFilterComponent.expanded).toBeFalse();
//     });

//     it('should emit `collapse` event', async () => {
//       // Arrange
//       const collapsePromise = dataFilterComponent.collapse.pipe(mapTo(true), take(1), shareReplay()).toPromise();

//       // Act
//       dataFilterComponent.collapseComponent();

//       // Assert
//       expect(await collapsePromise).toBeTrue();
//     });

//     it('should assign `collapsed` class for data filter element', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.collapseComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(Object.keys(dataFilterDebugElement.classes)).toContain('collapsed');
//     });

//     it('should remove `expanded` class from data filter element', () => {
//       // Arrange
//       // Act
//       dataFilterComponent.collapseComponent();
//       fixture.detectChanges();

//       // Assert
//       expect(Object.keys(dataFilterDebugElement.classes)).not.toContain('expanded');
//     });
//   });

//   describe('filter options rendering', () => {
//     it('should have only uniq options rendered for field without explicitly specified options', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//         {
//           someField: 'someValue', // the same as for first element in order to test distinct
//           someId: 'someId',
//         },
//         {
//           someField: 'some',
//           someId: 'someId',
//         },
//       ];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();
//       const filterFieldElement = dataFilterDebugElement.query(By.css(`#${filterDefinition.fieldId}.filter-field`));
//       const optionsElements = filterFieldElement.queryAll(By.css('.filter-option'));
//       const distinctPossibleOptions = distinct(testComponent.data.map(filterDefinition.propertySelector));

//       // Assert
//       expect(optionsElements.length).toBe(distinctPossibleOptions.length);
//       distinctPossibleOptions.forEach((x, i) => {
//         expect(
//           optionsElements[i].query(By.css('.filter-option-label')).nativeElement.innerText.startsWith(x)
//         ).toBeTrue();
//       });
//     });

//     it('should have options rendered for field with explicitly specified options with specified values', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//         options: [
//           {
//             value: 'someOptionValue1',
//           },
//           {
//             value: 'someOptionValue1',
//           },
//         ],
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//       ];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();
//       const filterFieldElement = dataFilterDebugElement.query(By.css(`#${filterDefinition.fieldId}.filter-field`));
//       const optionsElements = filterFieldElement.queryAll(By.css('.filter-option'));

//       // Assert
//       expect(optionsElements.length).toBe(filterDefinition.options.length);
//       filterDefinition.options.forEach((x, i) => {
//         expect(
//           optionsElements[i].query(By.css('.filter-option-label')).nativeElement.innerText.startsWith(x.value)
//         ).toBeTrue();
//       });
//     });

//     it('should have options rendered for field with explicitly specified options with custom property selector', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         multiSelector: true,
//         options: [
//           {
//             value: 'someValue',
//             customPropertySelector: (x) => x.someField,
//           },
//           {
//             value: 'someId',
//             customPropertySelector: (x) => x.someId,
//           },
//         ],
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//       ];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();
//       const filterFieldElement = dataFilterDebugElement.query(By.css(`#${filterDefinition.fieldId}.filter-field`));
//       const optionsElements = filterFieldElement.queryAll(By.css('.filter-option'));

//       // Assert
//       expect(optionsElements.length).toBe(filterDefinition.options.length);
//       testComponent.data.forEach((x, i) => {
//         expect(
//           optionsElements[i].query(By.css('.filter-option-label')).nativeElement.innerText.startsWith(x.someField)
//         ).toBeTrue();
//       });
//     });
//   });

//   describe('reset', () => {
//     it('should set all selected options to false without valueChanges event', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const testObject = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [testObject];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();
//       const optionControl = dataFilterComponent.formGroup.controls[filterDefinition.fieldId].get(
//         filterDefinition.propertySelector(testObject)
//       );

//       const setValueSpy = spyOn(optionControl, 'setValue');

//       dataFilterComponent.reset();

//       // Assert
//       expect(setValueSpy).toHaveBeenCalledWith(null, { onlySelf: true, emitEvent: undefined });
//     });

//     it('should call `updateValueAndValidity` function in FormGroup', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [
//         {
//           someField: 'someValue',
//           someId: 'someId',
//         },
//       ];

//       // Act
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       const setValueSpy = spyOn(dataFilterComponent.formGroup, 'updateValueAndValidity');

//       dataFilterComponent.reset();

//       // Assert
//       expect(setValueSpy).toHaveBeenCalledWith({});
//     });

//     it('should not fail if formGroup is not defined', () => {
//       // Arrange
//       dataFilterComponent.formGroup = undefined;

//       // Act
//       dataFilterComponent.reset();

//       // Assert
//       expect(() => dataFilterComponent.reset()).not.toThrow();
//     });
//   });

//   describe('calculateCount', () => {
//     it('should calculate count of data by option', () => {
//       // Arrange
//       const value = 'someValue';
//       const dataMatchesFilter: TestData[] = [
//         {
//           someField: value,
//           someId: '1',
//         },
//         {
//           someField: value,
//           someId: '2',
//         },
//         {
//           someField: value,
//           someId: '3',
//         },
//       ];

//       const allData: TestData[] = [
//         ...dataMatchesFilter,
//         {
//           someField: 'another value',
//           someId: '1',
//         },
//       ];
//       const propSelector: (x: TestData) => any = (x) => x.someField;
//       dataFilterComponent.data = allData;

//       // Act
//       const actual = dataFilterComponent.calculateCount(propSelector, {
//         value: value,
//         icon: '_',
//         translationKey: '_',
//       });

//       // Assert
//       expect(actual).toBe(dataMatchesFilter.length);
//     });
//   });

//   describe('toggleOptions()', () => {
//     it('should check option if it is not checked', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       const fieldControl = dataFilterComponent.formGroup.controls[filterDefinition.fieldId] as FormGroup;

//       const optionControl = fieldControl.controls[filterDefinition.propertySelector(dataObject)];
//       const setValueSpy = spyOn(optionControl, 'setValue');
//       dataFilterComponent.toggleOptions([
//         {
//           fieldId: filterDefinition.fieldId,
//           value: filterDefinition.propertySelector(dataObject),
//         },
//       ]);

//       // Assert
//       expect(setValueSpy).toHaveBeenCalledWith(true, { emitEvent: false });
//     });

//     it('should uncheck option if it is checked', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       const fieldControl = dataFilterComponent.formGroup.controls[filterDefinition.fieldId] as FormGroup;

//       const optionControl = fieldControl.controls[filterDefinition.propertySelector(dataObject)];
//       optionControl.setValue(true);
//       const setValueSpy = spyOn(optionControl, 'setValue');
//       dataFilterComponent.toggleOptions([
//         {
//           fieldId: filterDefinition.fieldId,
//           value: filterDefinition.propertySelector(dataObject),
//         },
//       ]);

//       // Assert
//       expect(setValueSpy).toHaveBeenCalledWith(false, { emitEvent: false });
//     });

//     it('should call `updateValueAndValidity` in FormGroup', () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();

//       const fieldControl = dataFilterComponent.formGroup.controls[filterDefinition.fieldId] as FormGroup;
//       const updateValueAndValiditySpy = spyOn(fieldControl, 'updateValueAndValidity');
//       dataFilterComponent.toggleOptions([
//         {
//           fieldId: filterDefinition.fieldId,
//           value: filterDefinition.propertySelector(dataObject),
//         },
//       ]);

//       // Assert
//       expect(updateValueAndValiditySpy).toHaveBeenCalled();
//     });

//     it('should emit `filteringOptions` with options that was toggled', async () => {
//       // Arrange
//       const filterDefinition: FilterDefinition<TestData> = {
//         fieldId: 'someFieldId',
//         propertySelector: (x) => x.someField,
//       };

//       const dataObject: TestData = {
//         someField: 'someValue',
//         someId: 'someId',
//       };

//       testComponent.filteringDefinition = [filterDefinition];
//       testComponent.data = [dataObject];
//       const filteringEventPromise = dataFilterComponent.filteringOptions.pipe(shareReplay(), take(1)).toPromise();

//       // Act
//       fixture.detectChanges();
//       dataFilterComponent.expandComponent();
//       fixture.detectChanges();
//       dataFilterComponent.toggleOptions([
//         {
//           fieldId: filterDefinition.fieldId,
//           value: filterDefinition.propertySelector(dataObject),
//         },
//       ]);

//       // Assert
//       expect(await filteringEventPromise).toEqual({
//         someFieldId: {
//           someValue: {
//             value: 'someValue',
//             optionId: 'someValue',
//             checked: true,
//             displayed: true,
//             exactValue: 'someValue',
//           },
//         },
//       });
//     });
//   });

//   describe('filter event', () => {
//     describe('field definition with multi selection', () => {
//       let firstFilterDefinition: FilterDefinition<TestData>;

//       beforeEach(() => {
//         firstFilterDefinition = {
//           fieldId: 'someFieldId',
//           propertySelector: (x) => x.someField,
//         };
//       });

//       it('should filter data using multi options filtering', async () => {
//         // Arrange
//         const expectedData: TestData[] = [
//           { someField: 'value1', someId: 'someId' },
//           { someField: 'value2', someId: 'someId' },
//         ];

//         testComponent.filteringDefinition = [firstFilterDefinition];
//         testComponent.data = [
//           ...expectedData,
//           {
//             someField: 'value4',
//             someId: 'someId',
//           },
//           {
//             someField: 'value3',
//             someId: 'someId',
//           },
//         ];

//         // Act
//         fixture.detectChanges();
//         dataFilterComponent.expandComponent();
//         fixture.detectChanges();
//         const filterEventPromise = dataFilterComponent.filter.pipe(shareReplay(), take(1)).toPromise();

//         dataFilterComponent.formGroup.setValue({
//           [firstFilterDefinition.fieldId]: {
//             value1: true,
//             value2: true,
//             value3: false,
//             value4: false,
//           },
//         });

//         const actualFilteredData = await filterEventPromise;

//         // Assert
//         expect(expectedData).toEqual(actualFilteredData);
//       });

//       it('should filter data using all fields filtering', async () => {
//         // Arrange
//         const secondFilterDefinition: FilterDefinition<TestData> = {
//           fieldId: 'some_Id',
//           propertySelector: (x) => x.someId,
//         };

//         const expectedData: TestData[] = [{ someField: 'value1', someId: 'someId' }];

//         testComponent.filteringDefinition = [firstFilterDefinition, secondFilterDefinition];
//         testComponent.data = [
//           ...expectedData,
//           {
//             someField: 'value4',
//             someId: 'x',
//           },
//           {
//             someField: 'value3',
//             someId: 'x',
//           },
//         ];

//         // Act
//         fixture.detectChanges();
//         dataFilterComponent.expandComponent();
//         fixture.detectChanges();
//         const filterEventPromise = dataFilterComponent.filter.pipe(shareReplay(), take(1)).toPromise();

//         dataFilterComponent.formGroup.setValue({
//           [firstFilterDefinition.fieldId]: {
//             value1: true,
//             value3: false,
//             value4: false,
//           },
//           [secondFilterDefinition.fieldId]: {
//             someId: true,
//             x: false,
//           },
//         });

//         const actualFilteredData = await filterEventPromise;

//         // Assert
//         expect(expectedData).toEqual(actualFilteredData);
//       });
//     });

//     describe('field definitions with single selection', () => {
//       it('should select only single option', async () => {
//         // Arrange
//         const firstFilterDefinition: FilterDefinition<TestData> = {
//           fieldId: 'someFieldId',
//           singleSelection: true,
//           propertySelector: (x) => x.someField,
//         };

//         const expectedData: TestData[] = [{ someField: 'value1', someId: 'someId' }];

//         testComponent.filteringDefinition = [firstFilterDefinition];
//         testComponent.data = [
//           ...expectedData,
//           {
//             someField: 'value2',
//             someId: 'someId',
//           },
//         ];

//         // Act
//         fixture.detectChanges();
//         dataFilterComponent.expandComponent();
//         fixture.detectChanges();
//         const filterEventPromise = dataFilterComponent.filter.pipe(shareReplay(), take(1)).toPromise();
//         const valueAndValiditySpy = spyOn(dataFilterComponent.formGroup, 'updateValueAndValidity').and.callThrough();
//         const secondValueSpy = spyOn(
//           dataFilterComponent.formGroup.get(firstFilterDefinition.fieldId).get('value2'),
//           'setValue'
//         );
//         dataFilterComponent.formGroup.get(firstFilterDefinition.fieldId).get('value1').setValue(true);

//         const actualFilteredData = await filterEventPromise;

//         // Assert
//         expect(secondValueSpy).toHaveBeenCalledWith(false, { emitEvent: false });
//         expect(valueAndValiditySpy).toHaveBeenCalled();
//         expect(expectedData).toEqual(actualFilteredData);
//       });
//     });
//   });
// });
