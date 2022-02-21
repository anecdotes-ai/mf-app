import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { featureSelector } from '../../store';
import { FinishFocusingAction, FocusResourcesAction } from '../../store/actions';
import { FocusingResourcesMap } from '../../types';
import { FocusingService } from './focusing.service';

describe('FocusingService', () => {
  let serviceUnderTest: FocusingService;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FocusingService, provideMockStore()],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(FocusingService);
    mockStore = TestBed.inject(Store) as MockStore;
    mockStore.dispatch = jasmine.createSpy('dispatch');
    mockStore.refreshState();
  });

  describe('focusResources func', () => {
    it('should call FocusResourcesAction with FocusingResourcesMap conaining several resources', () => {
      // Arrange
      const focusingResourcesMap: FocusingResourcesMap = {
        fakeResourceFirst: 'fakeResourceFirstId',
        fakeResourceSecond: 'fakeResourceSecondId',
      };

      // Act
      serviceUnderTest.focusResources(focusingResourcesMap);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(FocusResourcesAction({ focusingResourcesMap }));
    });
  });

  describe('focusSingleResource func', () => {
    it('should call FocusResourcesAction with FocusingResourcesMap containing single resource', () => {
      // Arrange
      const resourceName = 'fakeResourceFirst';
      const resourceId = 'fakeResourceSecondId';

      // Act
      serviceUnderTest.focusSingleResource('fakeResourceFirst', 'fakeResourceSecondId');

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        FocusResourcesAction({
          focusingResourcesMap: {
            [resourceName]: resourceId,
          },
        })
      );
    });
  });

  describe('finishFocusing func', () => {
    it('should call FinishFocusingAction resource name', () => {
      // Arrange
      const resourceName = 'fakeResourceFirst';
      // Act
      serviceUnderTest.finishFocusing('fakeResourceFirst');

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        FinishFocusingAction({
          resourceName,
        })
      );
    });
  });

  describe('getFocusingStreamForResource func', () => {
    const resourceName = 'fakeResourceName';
    const resourceId = 'fakeResourceId';

    beforeEach(() => {
      mockStore.overrideSelector(featureSelector, {
        focusedResources: {
          [resourceName]: resourceId,
        },
      });
    });

    it('should return resource id by resource name', fakeAsync(() => {
      // Arrange
      let actualId: string;

      // Act
      serviceUnderTest.getFocusingStreamForResource(resourceName).subscribe((id) => {
        actualId = id;
      });
      tick(600);

      // Assert
      expect(actualId).toBe(resourceId);
    }));

    it('should not emit when there is no provided resource in state', fakeAsync(() => {
      // Arrange
      let isEmitted = false;

      // Act
      serviceUnderTest.getFocusingStreamForResource('not-existing-resource').subscribe(() => {
        isEmitted = true;
      });
      tick(600);

      // Assert
      expect(isEmitted).toBeFalsy('Being returned observable should not emit value');
    }));
  });

  describe('getFocusingStreamByResourceId func', () => {
    const resourceName = 'fakeResourceName';
    const resourceId = 'fakeResourceId';

    beforeEach(() => {
      mockStore.overrideSelector(featureSelector, {
        focusedResources: {
          [resourceName]: resourceId,
        },
      });
    });

    it('should emit resource id by resource id and resource name', fakeAsync(() => {
      // Arrange
      let actualId: string;

      // Act
      serviceUnderTest.getFocusingStreamByResourceId(resourceName, resourceId).subscribe((id) => {
        actualId = id;
      });
      tick(600);

      // Assert
      expect(actualId).toBe(resourceId);
    }));

    it('should not emit when resource with specific name is in state but with another id', fakeAsync(() => {
      // Arrange
      let isEmitted = false;

      // Act
      serviceUnderTest.getFocusingStreamByResourceId(resourceName, 'not-existing-resource-id').subscribe(() => {
        isEmitted = true;
      });
      tick(600);

      // Assert
      expect(isEmitted).toBeFalsy('Being returned observable should not emit value');
    }));

    it('should not emit when there is no resource with specific id in state', fakeAsync(() => {
      // Arrange
      let isEmitted = false;

      // Act
      serviceUnderTest
        .getFocusingStreamByResourceId('not-existing-resource', 'not-existing-resource-id')
        .subscribe(() => {
          isEmitted = true;
        });
      tick(600);

      // Assert
      expect(isEmitted).toBeFalsy('Being returned observable should not emit value');
    }));

    it('should finish focusing once value emitted', fakeAsync(() => {
      // Arrange
      // Act
      serviceUnderTest.getFocusingStreamByResourceId(resourceName, resourceId).subscribe();
      tick(600);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(FinishFocusingAction({ resourceName: resourceName }));
    }));
  });
});
