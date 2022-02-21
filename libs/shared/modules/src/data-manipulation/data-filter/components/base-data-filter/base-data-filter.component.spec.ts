import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FilterDefinition, FilterOption } from '../../models';
import { BaseDataFilterComponent } from './base-data-filter.component';

describe('AbstractDataFilterComponent', () => {
  let component: BaseDataFilterComponent;
  let fixture: ComponentFixture<BaseDataFilterComponent>;

  let fakeValue: string;
  let secondFakeValue: string;
  let fakeField: string;
  let secondFakeField: string;
  let fieldId: string;
  let secondFieldId: string;
  let optionId: string;
  let secondOptionId: string;
  let data;
  let option: FilterOption<any>;
  let secondOption: FilterOption<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseDataFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataFilterComponent);
    component = fixture.componentInstance;

    fakeValue = 'fakeFieldValue';
    secondFakeValue = 'secondFakeValue';
    fakeField = 'fakeField';
    secondFakeField = 'secondFakeField';
    fieldId = 'fakeFieldId';
    secondFieldId = 'secondFieldId';
    optionId = 'fakeOptionId';
    secondOptionId = 'secondFakeOptionId';
    option = {
      optionId: optionId,
      value: fakeValue,
    };
    secondOption = {
      optionId: secondOptionId,
      value: secondFakeValue,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reset function', () => {
    let ignoreForReset = false;
    fakeValue = 'fakeFieldValue';
    fakeField = 'fakeField';
    fieldId = 'fakeFieldId';
    optionId = 'fakeOptionId';
    data = [{ [fakeField]: fakeValue }];
    option = {
      optionId: optionId,
      value: fakeValue,
    };

    beforeEach(() => {
      component.data = data;
      component.filteringDefinition = [
        {
          fieldId: fieldId,
          propertySelector: (x) => x[fakeField],
          options: [option],
          ignoreForReset,
        },
      ];
    });

    it('should reset options without checkedByDefault equal to true', () => {
      // Arrange
      option.checkedByDefault = false;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(fieldId).get(optionId).setValue(true);

      // Act
      component.reset();

      // Assert
      expect(component.formGroup.get(fieldId).get(optionId).value).toBeFalsy();
    });

    it('should not reset option that has checkedByDefault equal to true if it is already checked', () => {
      // Arrange
      option.checkedByDefault = true;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(fieldId).get(optionId).setValue(true);

      // Act
      component.reset();

      // Assert
      expect(component.formGroup.get(fieldId).get(optionId).value).toBeTruthy();
    });

    it('should reset option that has checkedByDefault equal to true to checked state if it is not checked', () => {
      // Arrange
      option.checkedByDefault = true;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(fieldId).get(optionId).setValue(false);

      // Act
      component.reset();

      // Assert
      expect(component.formGroup.get(fieldId).get(optionId).value).toBeTruthy();
    });

    it('should not reset field that has ignoreForReset equal to true', () => {
      // Arrange
      option.checkedByDefault = false;
      ignoreForReset = true;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(fieldId).setValue({ [optionId]: false });

      // Act
      component.reset();

      // Assert
      expect(component.formGroup.get(fieldId).value).toEqual({ [optionId]: false });
    });
  });

  describe('resetField function', () => {
    data = [{ [fakeField]: fakeValue, [secondFakeField]: secondFakeValue }];
    beforeEach(() => {
      component.data = data;
      component.filteringDefinition = [
        {
          fieldId: fieldId,
          propertySelector: (x) => x[fakeField],
          options: [option],
        },
        {
          fieldId: secondFieldId,
          propertySelector: (x) => x[secondFieldId],
          options: [secondOption],
        },
      ];
      fixture.detectChanges();
    });

    it('should reset field by field id', () => {
      // Arrange
      option.checkedByDefault = false;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(secondFieldId).get(secondOptionId).setValue(true);

      // Act
      component.resetField(fieldId);

      // Assert
      expect(component.formGroup.get(fieldId).get(optionId).value).toBeFalsy();
      expect(component.formGroup.get(secondFieldId).get(secondOptionId).value).toBeTruthy();
    });

    it('should not reset options in field by fieldId that has checkedByDefault equal to true if it is already checked', () => {
      // Arrange
      option.checkedByDefault = true;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(secondFieldId).get(secondOptionId).setValue(true);

      // Act
      component.resetField(fieldId);

      // Assert
      expect(component.formGroup.get(fieldId).get(optionId).value).toBeTruthy();
      expect(component.formGroup.get(secondFieldId).get(secondOptionId).value).toBeTruthy();
    });

    it('should check options in field by fieldId that has checkedByDefault equal to true if they are not checked', () => {
      // Arrange
      option.checkedByDefault = true;
      fixture.detectChanges();
      component.initialize();
      component.formGroup.get(secondFieldId).get(secondOptionId).setValue(true);
      component.formGroup.get(fieldId).get(optionId).setValue(false);

      // Act
      component.resetField(fieldId);

      // Assert
      expect(component.formGroup.get(fieldId).get(optionId).value).toBeTruthy();
      expect(component.formGroup.get(secondFieldId).get(secondOptionId).value).toBeTruthy();
    });
  });

  describe('refreshFilters function', () => {
    data = [{ [fakeField]: fakeValue, [secondFakeField]: secondFakeValue }];
    beforeEach(() => {
      component.data = data;
      component.filteringDefinition = [
        {
          fieldId: fieldId,
          propertySelector: (x) => x[fakeField],
          options: [option],
        },
        {
          fieldId: secondFieldId,
          propertySelector: (x) => x[secondFieldId],
          options: [secondOption],
        },
      ];
    });

    it('should trigger filter data when refreshFlters is executed', fakeAsync(() => {
      // Arrange
      fixture.detectChanges();
      component.initialize();
      spyOn(component.filter, 'emit');

      // Act
      data['test'] = 'test';
      component.data = data;
      fixture.detectChanges();
      tick();
      expect(component.filter.emit).toHaveBeenCalledTimes(0);
      component.refreshFilter();
      tick();

      // Assert
      expect(component.filter.emit).toHaveBeenCalledWith(data);
    }));

    it('should refresh filter when refreshFilters is executed', fakeAsync(() => {
      // Arrange
      fixture.detectChanges();
      component.initialize();
      spyOn(component.filter, 'emit');

      // Act
      component.refreshFilter();
      tick();

      // Assert
      expect(component.filter.emit).toHaveBeenCalledWith(component.data);
    }));
  });
  describe('Check fixed options logic', () => {
    const valueNotExistInData = 'empty';
    data = [
      {
        [fakeField]: fakeValue,
      },
    ];

    beforeEach(() => {
      component.data = data;
      component.filteringDefinition = [
        {
          fieldId: fieldId,
          propertySelector: (x) => x[fakeField],
          fixedOptions: [
            {
              optionId: optionId,
              value: valueNotExistInData
            },
          ]
        },
      ];
    });

    it('should correctly filter data with nested properties', () => {
      // Arrange
      fixture.detectChanges();
      component.initialize();

      // Assert - check that the option exist even if the count is 0
      expect(component.formGroup.get(fieldId).get(optionId)).toBeTruthy();
    });

    it('should correctly filter data with nested properties', () => {
      // Arrange
      component.filteringDefinition = [
        {
          fieldId: fieldId,
          propertySelector: (x) => x[fakeField]
        },
      ];
      fixture.detectChanges();
      component.initialize();

      // Assert - Should not exist
      expect(component.formGroup.get(fieldId).get(optionId)).toBeFalsy();
    });

  });
  
  describe('filtering logic', () => {
    describe('nested properties filter', () => {
      const firstNestedFieldName = 'firstNestedFieldName';
      const secondNestedFieldName = 'secondNestedFieldName';
      const innerFieldName = 'innerFieldName';
      const innerFieldValue = 'some-value';
      const someOptionId = 'someOptionId';
      data = [
        {
          [fakeField]: fakeValue,
          [firstNestedFieldName]: [
            { [secondNestedFieldName]: [{ [innerFieldName]: innerFieldValue }, { [innerFieldName]: 'another-value' }] },
            { [secondNestedFieldName]: [{ [innerFieldName]: 'another-value' }] },
          ],
        },
      ];

      beforeEach(() => {
        component.data = data;
        component.filteringDefinition = [
          {
            fieldId: fieldId,
            propertySelector: (x) => x[fakeField],
            options: [
              {
                optionId: someOptionId,
                value: fakeValue,
                exactValue: innerFieldValue,
              },
            ],
            nestedFiltering: true,
            nestedOptions: {
              propertyName: firstNestedFieldName,
              filterCriteria: (item: any, optionValue: any) =>
                item[secondNestedFieldName].some((innerItem) => innerItem[innerFieldName] === optionValue),
              nestedOptions: {
                propertyName: secondNestedFieldName,
                propertySelector: (item: any) => item[innerFieldName],
              },
            },
          },
        ];
      });

      it('should correctly filter data with nested properties', () => {
        // Arrange
        fixture.detectChanges();
        component.initialize();
        spyOn(component.filter, 'emit');

        const filteredData = [
          {
            [fakeField]: fakeValue,
            [firstNestedFieldName]: [{ [secondNestedFieldName]: [{ [innerFieldName]: innerFieldValue }] }],
          },
        ];

        // Act
        component.formGroup.get(fieldId).get(someOptionId).setValue(true);

        // Assert
        expect(component.filter.emit).toHaveBeenCalledWith(filteredData);
      });
    });
  });
});
