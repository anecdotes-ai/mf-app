import { first } from 'rxjs/operators';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidencePreviewHostComponent, EvidencePreviewTypeEnum } from './evidence-preview-host.component';
import { EvidenceService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of, Subject } from 'rxjs';
import { EvidenceInstance, EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { EvidencePreviewModalsContext } from 'core/modules/shared-controls/services/evidence-preview-service/evidence-preview.service';
import { EvidenceSourcesEnum } from 'core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EvidencePreviewHostComponent', () => {
  configureTestSuite();

  let component: EvidencePreviewHostComponent;
  let fixture: ComponentFixture<EvidencePreviewHostComponent>;
  let evidenceService: EvidenceService;
  let switcher: ComponentSwitcherDirective;

  const preview = 'some-preview';

  class MockSwitcherDir {
    public sharedContext$ = new Subject<any>();
  }

  const evidence: EvidenceInstance = {
    evidence_id: 'id',
    evidence_instance_id: 'id',
    evidence_type: EvidenceTypeEnum.CONFIGURATION,
  };

  const payload: EvidencePreviewModalsContext = {
    evidence,
    eventSource: EvidenceSourcesEnum.EvidencePool,
    entityPath: ['some', 'path'],
  };

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidencePreviewHostComponent],
      providers: [
        { provide: EvidenceService, useValue: {} },
        {
          provide: ComponentSwitcherDirective,
          useClass: MockSwitcherDir,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePreviewHostComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.getEvidencePreview = jasmine.createSpy('getEvidencePreview').and.returnValue(of(preview));

    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.sharedContext$ = of(payload);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should set right data from switcher sharedContext', async () => {
      // Arrange
      const payloadFromContext = await switcher.sharedContext$.pipe(first()).toPromise();

      // Act
      // Assert
      expect(payloadFromContext).toEqual(payload);
    });

    it('should set right evidenceType', () => {
      // // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.evidenceType).toBe(EvidencePreviewTypeEnum.EvidencePreview);
    });
  });
});
