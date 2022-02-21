import { TestBed } from '@angular/core/testing';
import { FocusingService } from 'core/modules/focusing-mechanism';
import { Observable, of } from 'rxjs';
import { ControlsFocusingService } from './controls-focusing.service';
import { ResourceType } from 'core/modules/data/models';

describe('ControlsFocusingService', () => {
  let serviceUnderTest: ControlsFocusingService;

  let focusingServiceMock: FocusingService;

  let streamFromFocusingResource: Observable<string>;
  let streamFromFocusingResourceById: Observable<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlsFocusingService, { provide: FocusingService, useValue: {} }],
    });
  });

  beforeEach(() => {
    serviceUnderTest = TestBed.inject(ControlsFocusingService);
    focusingServiceMock = TestBed.inject(FocusingService);

    focusingServiceMock.focusResources = jasmine.createSpy('focusResources');
    focusingServiceMock.focusSingleResource = jasmine.createSpy('focusSingleResource');
    focusingServiceMock.finishFocusing = jasmine.createSpy('finishFocusing');
    focusingServiceMock.getFocusingStreamByResourceId = jasmine
      .createSpy('getFocusingStreamByResourceId')
      .and.callFake(() => streamFromFocusingResourceById);
    focusingServiceMock.getFocusingStreamForResource = jasmine
      .createSpy('getFocusingStreamForResource')
      .and.callFake(() => streamFromFocusingResource);

    streamFromFocusingResource = of('any-id');
    streamFromFocusingResourceById = of('any-id');
  });

  describe('focusControl func', () => {
    it('should call focusSingleResource', () => {
      // Arrange
      const fakeControlId = 'fake-id';

      // Act
      serviceUnderTest.focusControl(fakeControlId);

      // Assert
      expect(focusingServiceMock.focusSingleResource).toHaveBeenCalledWith(ResourceType.Control, fakeControlId);
    });
  });

  describe('focusControlWithExpanding func', () => {
    it('should call focusResources with resource name for control and expanded control', () => {
      // Arrange
      const fakeControlId = 'fake-id';

      // Act
      serviceUnderTest.focusControlWithExpanding(fakeControlId);

      // Assert
      expect(focusingServiceMock.focusResources).toHaveBeenCalledWith({
        [ResourceType.Control]: fakeControlId,
        ['ExpandControl']: fakeControlId,
      });
    });
  });

  describe('focusRequirement func', () => {
    it('should call focusResources with control, expanding control and requirement', () => {
      // Arrange
      const fakeControlId = 'fake-id';
      const fakeRequirementId = 'fake-req-id';

      // Act
      serviceUnderTest.focusRequirement(fakeControlId, fakeRequirementId);

      // Assert
      expect(focusingServiceMock.focusResources).toHaveBeenCalledWith({
        [ResourceType.Control]: fakeControlId,
        [ResourceType.Requirement]: fakeRequirementId,
        ['ExpandControl']: fakeControlId,
      });
    });
  });

  describe('focusEvidence func', () => {
    it('should call focusResources with control, expanding control and evidence', () => {
      // Arrange
      const fakeControlId = 'fake-id';
      const fakeEvidenceId = 'fake-ev-id';

      // Act
      serviceUnderTest.focusEvidence(fakeControlId, fakeEvidenceId);

      // Assert
      expect(focusingServiceMock.focusResources).toHaveBeenCalledWith({
        [ResourceType.Control]: fakeControlId,
        [ResourceType.Evidence]: fakeEvidenceId,
        ['ExpandControl']: fakeControlId,
      });
    });
  });

  describe('finishControlFocusing func', () => {
    it('should call finishFocusing with control', () => {
      // Arrange
      // Act
      serviceUnderTest.finishControlFocusing();

      // Assert
      expect(focusingServiceMock.finishFocusing).toHaveBeenCalledWith(ResourceType.Control);
    });
  });

  describe('finishControlExpanding func', () => {
    it('should call finishFocusing with ExpandControl', () => {
      // Arrange
      // Act
      serviceUnderTest.finishControlExpanding();

      // Assert
      expect(focusingServiceMock.finishFocusing).toHaveBeenCalledWith('ExpandControl');
    });
  });

  describe('getControlsFocusingStream func', () => {
    it('should return stream by control resource name', () => {
      // Arrange
      // Act
      const actualStream = serviceUnderTest.getControlsFocusingStream();

      // Assert
      expect(focusingServiceMock.getFocusingStreamForResource).toHaveBeenCalledWith(ResourceType.Control);
      expect(actualStream).toBe(streamFromFocusingResource);
    });
  });

  describe('getSpecificControlFocusingStream func', () => {
    it('should return stream by control resource name and specific id', () => {
      // Arrange
      const fakeControlId = 'fake-id';

      // Act
      const actualStream = serviceUnderTest.getSpecificControlFocusingStream(fakeControlId);

      // Assert
      expect(focusingServiceMock.getFocusingStreamByResourceId).toHaveBeenCalledWith(
        ResourceType.Control,
        fakeControlId
      );
      expect(actualStream).toBe(streamFromFocusingResourceById);
    });
  });

  describe('getSpecificControlExpandingStream func', () => {
    it('should return stream by ExpandControl name and specific id', () => {
      // Arrange
      const fakeControlId = 'fake-id';

      // Act
      const actualStream = serviceUnderTest.getSpecificControlExpandingStream(fakeControlId);

      // Assert
      expect(focusingServiceMock.getFocusingStreamByResourceId).toHaveBeenCalledWith('ExpandControl', fakeControlId);
      expect(actualStream).toBe(streamFromFocusingResourceById);
    });
  });

  describe('getSpecificRequirementFocusingStream func', () => {
    it('should return stream by Requirement name and specific id', () => {
      // Arrange
      const fakeRequirementId = 'fake-id';

      // Act
      const actualStream = serviceUnderTest.getSpecificRequirementFocusingStream(fakeRequirementId);

      // Assert
      expect(focusingServiceMock.getFocusingStreamByResourceId).toHaveBeenCalledWith(
        ResourceType.Requirement,
        fakeRequirementId
      );
      expect(actualStream).toBe(streamFromFocusingResourceById);
    });
  });

  describe('getSpecificEvidenceFocusingStream func', () => {
    it('should return stream by Evidence name and specific id', () => {
      // Arrange
      const fakeEvidenceId = 'fake-id';

      // Act
      const actualStream = serviceUnderTest.getSpecificEvidenceFocusingStream(fakeEvidenceId);

      // Assert
      expect(focusingServiceMock.getFocusingStreamByResourceId).toHaveBeenCalledWith(
        ResourceType.Evidence,
        fakeEvidenceId
      );
      expect(actualStream).toBe(streamFromFocusingResourceById);
    });
  });
});
