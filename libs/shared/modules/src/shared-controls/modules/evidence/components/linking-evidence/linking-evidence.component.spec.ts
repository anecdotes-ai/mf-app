import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { EvidenceFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { LinkingEvidenceComponent } from './linking-evidence.component';
import { EvidenceModalIds } from '../../models';
import { NEVER } from 'rxjs';

describe('LinkingEvidenceComponent', () => {
  let component: LinkingEvidenceComponent;
  let fixture: ComponentFixture<LinkingEvidenceComponent>;

  let requirementsFacadeServiceMock: RequirementsFacadeService;
  let componentSwitcherDirectiveMock: ComponentSwitcherDirective;
  let evidenceFacade: EvidenceFacadeService;

  const fakeRequirementId = 'fakeRequirementId';
  const fakeEvidenceId = 'fakeEvidenceId';
  const fakeControlId = 'fakeControlId';
  const fakeFrameworkId = 'fakeFrameworkId';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkingEvidenceComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkingEvidenceComponent);
    component = fixture.componentInstance;
    componentSwitcherDirectiveMock = TestBed.inject(ComponentSwitcherDirective);
    componentSwitcherDirectiveMock.goById = jasmine.createSpy('goById');
    requirementsFacadeServiceMock = TestBed.inject(RequirementsFacadeService);
    requirementsFacadeServiceMock.linkEvidenceAsync = jasmine.createSpy('linkEvidenceAsync').and.callFake(() => Promise.resolve());
    evidenceFacade = TestBed.inject(EvidenceFacadeService);
    evidenceFacade.evidencePoolCollectionEvent = jasmine.createSpy('evidencePoolCollectionEvent').and.callFake(() => Promise.resolve());

    component.requirementLike = { resourceId: fakeRequirementId };
    component.evidence = { evidence_id: fakeEvidenceId };
    component.controlInstance = {control_id: fakeControlId };
    component.framework = {framework_id: fakeFrameworkId };

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('link', () => {
    it('should call linkEvidenceAsync with proper params', async () => {
      // Arrange
      // Act
      await component.link();

      // Assert
      expect(requirementsFacadeServiceMock.linkEvidenceAsync).toHaveBeenCalledWith(fakeRequirementId, fakeEvidenceId, false, fakeControlId, fakeFrameworkId);
      expect(evidenceFacade.evidencePoolCollectionEvent).toHaveBeenCalledWith(fakeRequirementId, fakeControlId, fakeFrameworkId);
    });

    it(`should call goById with "${EvidenceModalIds.Success}" id if operation succeeds`, async () => {
      // Arrange
      // Act
      await component.link();

      // Assert
      expect(componentSwitcherDirectiveMock.goById).toHaveBeenCalledWith(EvidenceModalIds.Success);
    });

    it(`should call goById with "${EvidenceModalIds.Error}" id if operation fails`, async () => {
      // Arrange
      requirementsFacadeServiceMock.linkEvidenceAsync = jasmine.createSpy('linkEvidenceAsync').and.callFake(() => Promise.reject());

      // Act
      await component.link();

      // Assert
      expect(componentSwitcherDirectiveMock.goById).toHaveBeenCalledWith(EvidenceModalIds.Error);
    });

    it('should emit true to linkingInProcess$ before processing', () => {
      // Arrange
      component.linkingInProcess$.next = jasmine.createSpy('next').and.callThrough();
      requirementsFacadeServiceMock.linkEvidenceAsync = jasmine.createSpy('linkEvidenceAsync').and.callFake(() => NEVER.toPromise());

      // Act
      component.link();

      // Assert
      expect(component.linkingInProcess$.next).toHaveBeenCalledBefore(requirementsFacadeServiceMock.linkEvidenceAsync);
      expect(component.linkingInProcess$.next).toHaveBeenCalledWith(true);
    });

    it('should emit false to linkingInProcess$ after processing', () => {
      // Arrange
      component.linkingInProcess$.next = jasmine.createSpy('next');
      requirementsFacadeServiceMock.linkEvidenceAsync = jasmine.createSpy('linkEvidenceAsync').and.callFake(() => NEVER.toPromise());

      // Act
      component.link();

      // Assert
      expect(component.linkingInProcess$.value).toBe(false);
    });
  });

  describe('buildTranslationKey', () => {
    it('should return value based on relative key', () => {
      // Arrange
      const relativeKey = 'fake';

      // Act
      const actualFullKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualFullKey).toBe(`connectEvidenceModal.${relativeKey}`);
    });
  });
});
