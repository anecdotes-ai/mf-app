import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FrameworkReference, ResourceType } from 'core/modules/data/models';
import { DataAggregationFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ElementInfoComponent } from './element-info.component';

describe('ElementInfoComponent', () => {
  configureTestSuite();

  let component: ElementInfoComponent;
  let fixture: ComponentFixture<ElementInfoComponent>;
  let dataAggregationFacadeService: DataAggregationFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [DatePipe, { provide: DataAggregationFacadeService, useValue: {} }],
        declarations: [ElementInfoComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementInfoComponent);
    component = fixture.componentInstance;

    component.requirementLike = { resourceId: '123', resourceType: ResourceType.Policy };

    dataAggregationFacadeService = TestBed.inject(DataAggregationFacadeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey function', () => {
    it('should return full translation key', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`components.elementInfo.${relativeKey}`);
    });
  });

  [ResourceType.Policy, ResourceType.Requirement].forEach((resourceTypeTestCase) => {
    describe(`when resource type is ${resourceTypeTestCase}`, () => {
      const firstFrameworkName = 'first_framework';
      const secondFrameworkName = 'second_framework';

      beforeEach(() => {
        component.requirementLike.relatedFrameworksNames = {
          [firstFrameworkName]: [],
          [secondFrameworkName]: [],
        };
        component.requirementLike.resourceType = resourceTypeTestCase;

        dataAggregationFacadeService.getRequirementRelatedFrameworks = jasmine
          .createSpy('getRequirementRelatedFrameworks')
          .and.returnValue(
            of([
              { framework: { framework_name: firstFrameworkName }, controls: [] },
              { framework: { framework_name: secondFrameworkName }, controls: [] },
            ] as FrameworkReference[])
          );
      });

      describe('isFrameworksNotEmpty property', () => {
        it('should return false if there are no related frameworks', () => {
          // Arrange
          component.requirementLike.relatedFrameworksNames = {};
          dataAggregationFacadeService.getRequirementRelatedFrameworks = jasmine
          .createSpy('getRequirementRelatedFrameworks')
          .and.returnValue(of([] as FrameworkReference[]));

          // Act
          fixture.detectChanges();

          // Assert
          expect(component.isFrameworksNotEmpty).toBeFalse();
        });

        it('should return true if there is at least one related framework', () => {
          // Arrange
          // Act
          fixture.detectChanges();

          // Assert
          expect(component.isFrameworksNotEmpty).toBeTrue();
        });
      });

      describe('prepareFrameworksToString function', () => {
        it('should return comma separated framework names', () => {
          //Arrange
          //Act
          fixture.detectChanges();
          const actual = component.prepareFrameworksToString();

          //Assert
          expect(actual).toEqual(`${firstFrameworkName}, ${secondFrameworkName}`);
        });
      });
    });
  });

  describe(`when resource type is ${ResourceType.Requirement}`, () => {
    it('should get requirement related frameworks', () => {
      //Arrange
      component.requirementLike.resourceType = ResourceType.Requirement;

      //Act
      fixture.detectChanges();

      //Assert
      expect(dataAggregationFacadeService.getRequirementRelatedFrameworks).toHaveBeenCalledWith(
      component.requirementLike.resourceId
      );
    });
  });
});
