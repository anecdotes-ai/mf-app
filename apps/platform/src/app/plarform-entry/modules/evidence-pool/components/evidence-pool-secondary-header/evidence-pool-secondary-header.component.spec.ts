import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataSortComponent } from 'core/modules/data-manipulation/sort';
import { configureTestSuite } from 'ng-bullet';
import { RootTranslationkey } from './../../constants/translation-keys.constant';
import { EvidencePoolSecondaryHeaderComponent } from './evidence-pool-secondary-header.component';

describe('EvidencePoolSecondaryHeaderComponent', () => {
  configureTestSuite();

  let component: EvidencePoolSecondaryHeaderComponent;
  let fixture: ComponentFixture<EvidencePoolSecondaryHeaderComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [EvidencePoolSecondaryHeaderComponent, DataSortComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePoolSecondaryHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should pass changed data to sort component', () => {
      // Arrange
      fixture.detectChanges();
      const dataToDisplay = [{ evidence_id: 'evidence_id' }];
      component.dataToDisplay = dataToDisplay;
      const changes: SimpleChanges = {
        dataToDisplay: new SimpleChange(null, dataToDisplay, true),
      };
      const sortComponent = fixture.debugElement.query(By.directive(DataSortComponent))
        .componentInstance as DataSortComponent;

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(sortComponent.dataToMakeOperations).toEqual(dataToDisplay);
    });

    it('should sort data if data is changed', () => {
      // Arrange
      fixture.detectChanges();
      const dataToDisplay = [{ evidence_id: 'evidence_id' }];
      component.dataToDisplay = dataToDisplay;
      const changes: SimpleChanges = {
        dataToDisplay: new SimpleChange(null, dataToDisplay, true),
      };
      const sortComponent = fixture.debugElement.query(By.directive(DataSortComponent))
        .componentInstance as DataSortComponent;
      spyOn(sortComponent, 'sortBySelectedDefinition');

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(sortComponent.sortBySelectedDefinition).toHaveBeenCalled();
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`${RootTranslationkey}.secondaryHeader.${relativeKey}`);
    });
  });

  describe('#ngOnInit', () => {
    it('should set correct sort definition by date', () => {
      // Arrange
      const evidence_collection_timestamp = new Date(2021, 1, 1);
      const evidence = { evidence_collection_timestamp };

      // Act
      fixture.detectChanges();

      // Assert
      const dateSortDefinition = component.sortDefinition[0];
      expect(dateSortDefinition.id).toEqual('by-date');
      expect(dateSortDefinition.translationKey).toEqual('By Date');
      expect(dateSortDefinition.propertySelector(evidence)).toEqual(evidence_collection_timestamp);
    });

    it('should set correct sort definition by plugin', () => {
      // Arrange
      const evidence_service_display_name = 'plugin';
      const evidence = { evidence_service_display_name };

      // Act
      fixture.detectChanges();

      // Assert
      const pluginSortDefinition = component.sortDefinition[1];
      expect(pluginSortDefinition.id).toEqual('by-plugin');
      expect(pluginSortDefinition.translationKey).toEqual('By Plugin');
      expect(pluginSortDefinition.propertySelector(evidence)).toEqual(evidence_service_display_name);
    });
  });
});
