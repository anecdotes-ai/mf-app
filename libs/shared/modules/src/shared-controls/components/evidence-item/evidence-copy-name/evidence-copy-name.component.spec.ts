import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceCopyNameComponent } from './evidence-copy-name.component';
import { configureTestSuite } from 'ng-bullet';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';
import { EvidenceSourcesEnum } from 'core';
import { ResourceType } from 'core/modules/data/models';

describe('EvidenceCopyNameComponent', () => {
  configureTestSuite();
  let component: EvidenceCopyNameComponent;
  let fixture: ComponentFixture<EvidenceCopyNameComponent>;

  let generalEventService: GeneralEventService;

  const translationKey = 'evidences.evidenceLabel';
  const source = EvidenceSourcesEnum.Controls;
  const type = ResourceType.Evidence;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceCopyNameComponent],
      providers: [{ provide: GeneralEventService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceCopyNameComponent);
    component = fixture.componentInstance;
    component.type = type;
    component.source = source;

    generalEventService = TestBed.inject(GeneralEventService);
    generalEventService.trackCopyNameEvent = jasmine.createSpy('trackCopyNameEvent');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buildTranslationKey method should return appropriate key', () => {
    // Arrange
    const key = 'someKey';

    // Act
    const resultKey = component.buildTranslationKey(key);

    // Assert
    expect(resultKey).toEqual(`${translationKey}.${key}`);
  });

  it('should set initial text for component.currentTooltipText', () => {
    // Arrange
    const key = 'copyNameInitialText';

    // Act
    component.setInitialText();

    // Assert
    expect(component.currentTooltipText).toEqual(`${translationKey}.${key}`);
  });

  it('should write entityName to clipboard and set properties', () => {
    // Arrange
    const key = 'copyNameCopiedText';
    component.entityName = 'some-entity';
    navigator.clipboard.writeText = jasmine.createSpy('writeText');

    // Act
    component.copyEntityName();

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('some-entity');
    expect(component.currentTooltipText).toEqual(`${translationKey}.${key}`);
    expect(generalEventService.trackCopyNameEvent).toHaveBeenCalledWith(type, source);
  });
});
