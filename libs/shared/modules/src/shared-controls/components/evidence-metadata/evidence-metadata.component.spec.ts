import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceInstance, EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { EvidenceMetadataComponent } from './evidence-metadata.component';

describe('EvidenceMetadataComponent', () => {
  let component: EvidenceMetadataComponent;
  let fixture: ComponentFixture<EvidenceMetadataComponent>;
  let evidenceInstance: EvidenceInstance = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidenceMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceMetadataComponent);
    component = fixture.componentInstance;
    component.evidence = evidenceInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    it('should return correct translation key', () => {
      // Arrange
      const relativeKey = 'fakeKey';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`evidences.${relativeKey}`);
    });
  });

  describe('getTranslationKeyForEvidenceItemCount', () => {
    
    const rootKey = 'root';

    beforeEach(() => {
      component.evidence = evidenceInstance;
      spyOn(component, 'buildTranslationKey').and.callFake((r) => `${rootKey}.${r}`);
    });

    it(`should return correct translation key for ${EvidenceTypeEnum.LIST} when items count is more than 1`, () => {
      // Arrange
      evidenceInstance.evidence_items_count = 3123;
      evidenceInstance.evidence_type = EvidenceTypeEnum.LIST;

      // Act
      const actualTranslationKey = component.getTranslationKeyForEvidenceItemCount();

      // Assert
      expect(actualTranslationKey).toBe(`${rootKey}.evidenceItemsCount.${EvidenceTypeEnum.LIST.toLowerCase()}.plural`);
    });

    it(`should return correct translation key for ${EvidenceTypeEnum.CONFIGURATION} when items count is more than 1`, () => {
      // Arrange
      evidenceInstance.evidence_items_count = 3123;
      evidenceInstance.evidence_type = EvidenceTypeEnum.CONFIGURATION;

      // Act
      const actualTranslationKey = component.getTranslationKeyForEvidenceItemCount();

      // Assert
      expect(actualTranslationKey).toBe(
        `${rootKey}.evidenceItemsCount.${EvidenceTypeEnum.CONFIGURATION.toLowerCase()}.plural`
      );
    });

    it(`should return correct translation key for ${EvidenceTypeEnum.LOG} when items count is more than 1`, () => {
      // Arrange
      evidenceInstance.evidence_items_count = 3123;
      evidenceInstance.evidence_type = EvidenceTypeEnum.LOG;

      // Act
      const actualTranslationKey = component.getTranslationKeyForEvidenceItemCount();

      // Assert
      expect(actualTranslationKey).toBe(`${rootKey}.evidenceItemsCount.${EvidenceTypeEnum.LOG.toLowerCase()}.plural`);
    });

    it(`should return correct translation key for ${EvidenceTypeEnum.LIST} when items count is 1`, () => {
      // Arrange
      evidenceInstance.evidence_items_count = 1;
      evidenceInstance.evidence_type = EvidenceTypeEnum.LIST;

      // Act
      const actualTranslationKey = component.getTranslationKeyForEvidenceItemCount();

      // Assert
      expect(actualTranslationKey).toBe(
        `${rootKey}.evidenceItemsCount.${EvidenceTypeEnum.LIST.toLowerCase()}.singular`
      );
    });

    it(`should return correct translation key for ${EvidenceTypeEnum.CONFIGURATION} when items count is 1`, () => {
      // Arrange
      evidenceInstance.evidence_items_count = 1;
      evidenceInstance.evidence_type = EvidenceTypeEnum.CONFIGURATION;

      // Act
      const actualTranslationKey = component.getTranslationKeyForEvidenceItemCount();

      // Assert
      expect(actualTranslationKey).toBe(
        `${rootKey}.evidenceItemsCount.${EvidenceTypeEnum.CONFIGURATION.toLowerCase()}.singular`
      );
    });

    it(`should return correct translation key for ${EvidenceTypeEnum.LOG} when items count is 1`, () => {
      // Arrange
      evidenceInstance.evidence_items_count = 1;
      evidenceInstance.evidence_type = EvidenceTypeEnum.LOG;

      // Act
      const actualTranslationKey = component.getTranslationKeyForEvidenceItemCount();

      // Assert
      expect(actualTranslationKey).toBe(`${rootKey}.evidenceItemsCount.${EvidenceTypeEnum.LOG.toLowerCase()}.singular`);
    });
  });
});
