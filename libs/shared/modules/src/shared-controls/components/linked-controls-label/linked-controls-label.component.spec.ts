import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrameworkReference } from 'core/modules/data/models';
import { EvidenceInstance } from 'core/modules/data/models/domain';
import { DataAggregationFacadeService, EvidenceFacadeService } from 'core/modules/data/services';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { LinkedEntity } from 'core/modules/utils/types';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { LinkedControlsLabelComponent } from './linked-controls-label.component';

describe('LinkedControlsLabelComponent', () => {
  configureTestSuite();

  let componentUnderTest: LinkedControlsLabelComponent;
  let fixture: ComponentFixture<LinkedControlsLabelComponent>;

  let evidenceUserEventService: EvidenceUserEventService;
  let controlsNavigatorService: ControlsNavigator;
  let evidenceFacadeServiceMock: EvidenceFacadeService;
  let dataAggregationFacadeServiceMock: DataAggregationFacadeService;

  let fakeEvidence: EvidenceInstance;
  let fakeFrameworkReferences: FrameworkReference[] = [
    {
      framework: { framework_name: 'fake-framework-name' },
      controls: [{ control_name: 'fake-control-name' }, { control_name: 'fake-control-name2' }],
    },
    {
      framework: { framework_name: 'fake-framework-name2' },
      controls: [{ control_name: 'fake-control-name3' }],
    },
  ];

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LinkedControlsLabelComponent],
        imports: [RouterTestingModule, TranslateModule.forRoot()],
        providers: [
          provideMockStore(),
          { provide: DataAggregationFacadeService, useValue: {} },
          { provide: ControlsNavigator, useValue: {} },
          { provide: EvidenceUserEventService, useValue: {} },
          { provide: EvidenceFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedControlsLabelComponent);
    componentUnderTest = fixture.componentInstance;

    evidenceUserEventService = TestBed.inject(EvidenceUserEventService);
    evidenceUserEventService.trackLinkedControlClickEvent = jasmine.createSpy('trackLinkedControlClickEvent');

    controlsNavigatorService = TestBed.inject(ControlsNavigator);
    controlsNavigatorService.navigateToEvidenceAsync = jasmine.createSpy('navigateToEvidenceAsync');
    evidenceFacadeServiceMock = TestBed.inject(EvidenceFacadeService);
    evidenceFacadeServiceMock.getEvidence = jasmine.createSpy('getEvidence').and.callFake(() => of(fakeEvidence));
    fakeEvidence = { evidence_name: 'fake-evidence', evidence_id: 'fake-evidence-id' };
    componentUnderTest.evidenceId = fakeEvidence.evidence_id;

    dataAggregationFacadeServiceMock = TestBed.inject(DataAggregationFacadeService);
    dataAggregationFacadeServiceMock.getEvidenceReferences = jasmine
      .createSpy('getEvidenceReferences')
      .and.callFake(() => of(fakeFrameworkReferences));
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('Test: buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = componentUnderTest.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`evidencePool.${relativeKey}`);
    });
  });

  describe('viewControl', () => {
    const linkedEntity: LinkedEntity = { title: 'fake', id: 'fake-id' };

    it('should call navigateToEvidenceAsync with provided data via arguments', fakeAsync(() => {
      // Arrange
      const linkedEntity: LinkedEntity = { title: 'fake', id: 'fake-id' };

      // Act
      fixture.detectChanges();
      tick(50);
      componentUnderTest.viewControl(linkedEntity);

      // Assert
      expect(controlsNavigatorService.navigateToEvidenceAsync).toHaveBeenCalledWith(
        linkedEntity.id,
        fakeEvidence.evidence_id
      );
    }));

    it('should call trackLinkedControlClickEvent with appropriate params', fakeAsync(() => {
      // Arrange
      // Act
      fixture.detectChanges();
      tick(50);
      componentUnderTest.viewControl(linkedEntity);

      // Assert
      expect(evidenceUserEventService.trackLinkedControlClickEvent).toHaveBeenCalledWith(
        fakeEvidence.evidence_name,
        ['fake-framework-name', 'fake-framework-name2'],
        3
      );
    }));
  });
});
