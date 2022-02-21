import { EvidenceCollectionResult } from 'core/models/evidence-collection-result';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EvidenceTypeIconMapping, PluginNotificationSenderService, RouteParams } from 'core';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import {
  EvidenceFacadeService,
  EvidenceService,
  OperationsTrackerService,
  PluginService,
  RequirementService,
  TrackOperations,
} from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { EvidenceCollectionSkeletonComponent } from './evidence-collection-skeleton.component';

describe('EvidenceCollectionSkeletonComponent', () => {
  configureTestSuite();

  let component: EvidenceCollectionSkeletonComponent;
  let fixture: ComponentFixture<EvidenceCollectionSkeletonComponent>;

  let evidenceService: EvidenceService;
  let pluginService: PluginService;
  let router: Router;
  let evidencesFacade: EvidenceFacadeService;
  let messageBus: MessageBusService;
  let icon: Observable<string>;
  let evidenceFromFacade;
  let fakeOperationsTrackerService: OperationsTrackerService;
  const pluginRoute = 'route';

  const evidenceCollectionResult: EvidenceCollectionResult = {
    evidence_id: 'ev_id',
    successfully_collected: true,
    description: 'evidence_name',
  };

  const collectingEvidence = {
    serviceId: 'service-id',
    evidenceId: 'evidence-id',
    evidenceType: EvidenceTypeEnum.LINK,
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: EvidenceService, useValue: {} },
        { provide: RequirementService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: PluginService, useValue: {} },
        { provide: PluginNotificationSenderService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: OperationsTrackerService, useValue: {} },
      ],
      declarations: [EvidenceCollectionSkeletonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceCollectionSkeletonComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.getIcon = jasmine.createSpy('getIcon').and.callFake(() => icon);

    pluginService = TestBed.inject(PluginService);
    pluginService.getPluginRoute = jasmine.createSpy('getPluginRoute').and.callFake(() => pluginRoute);

    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy('navigate');

    evidencesFacade = TestBed.inject(EvidenceFacadeService);
    evidencesFacade.getEvidence = jasmine.createSpy('getEvidence').and.callFake(() => of(evidenceFromFacade));

    messageBus = TestBed.inject(MessageBusService);
    messageBus.getObservable = jasmine.createSpy('getObservable').and.callFake(() => of(evidenceCollectionResult));

    fakeOperationsTrackerService = TestBed.inject(OperationsTrackerService);
    fakeOperationsTrackerService.getOperationStatus = jasmine
      .createSpy('getOperationStatus')
      .and.callFake(() => of(collectingEvidence.evidenceId, TrackOperations.ADD_EVIDENCE_FROM_DEVICE));

    component.collectingEvidence = collectingEvidence;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should correctly get evidenceIcon', () => {
      // Arrange
      icon = of('icon');

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.evidenceIcon$).toBe(icon);
    });
  });

  describe('#ngOnChanges', () => {
    it('should correctly set fileTypeMapping', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.fileTypeMapping).toEqual(EvidenceTypeIconMapping[EvidenceTypeEnum.LINK]);
    });

    it('should set isManualOrUrlUpload to true if evidence type is MANUAL', () => {
      // Arrange
      collectingEvidence.evidenceType = EvidenceTypeEnum.MANUAL;
      component.collectingEvidence = collectingEvidence;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.isManualOrUrlUpload).toBeTrue();
    });

    it('should set isManualOrUrlUpload to true if evidence type is URL', () => {
      // Arrange
      collectingEvidence.evidenceType = EvidenceTypeEnum.URL;
      component.collectingEvidence = collectingEvidence;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.isManualOrUrlUpload).toBeTrue();
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`evidences.skeleton.${relativeKey}`);
    });
  });

  describe('#tryAgainClick', () => {
    it('should emit tryAgain', () => {
      // Arrange
      spyOn(component.tryAgain, 'emit');

      // Act
      component.tryAgainClick();

      // Assert
      expect(component.tryAgain.emit).toHaveBeenCalled();
    });

    it('should emit evidenceCollectionEnd', () => {
      // Arrange
      spyOn(component.evidenceCollectionEnd, 'emit');

      // Act
      component.tryAgainClick();

      // Assert
      expect(component.evidenceCollectionEnd.emit).toHaveBeenCalled();
    });
  });

  describe('#goToPluginPage', () => {
    it('should call router.navigate with resolved route from pluginService.getPluginRoute', () => {
      // Act
      component.goToPluginPage();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([pluginRoute], {
        queryParams: { [RouteParams.plugin.tabQueryParamName]: RouteParams.plugin.logsQueryParamValue },
      });
    });
  });

  describe('collection handling', () => {
    describe('collection success', () => {
      beforeEach(() => {
        evidenceFromFacade = {};
      });

      it('should emit evidenceCollectionEnd if evidence found in facade', () => {
        // Arrange
        spyOn(component.evidenceCollectionEnd, 'emit');

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.evidenceCollectionEnd.emit).toHaveBeenCalled();
      });
    });
  });
});
