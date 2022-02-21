import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceLabelComponent } from './evidence-label.component';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { FormControl } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GapMarkComponent } from 'core/modules/gap/components';
import { CombinedEvidenceInstance } from 'core/modules/data/models/domain';
import { SearchableTextComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { PoliciesFacadeService } from 'core/modules/data/services';

describe('EvidenceLabelComponent', () => {
  configureTestSuite();
  let component: EvidenceLabelComponent;
  let fixture: ComponentFixture<EvidenceLabelComponent>;
  let translateService: TranslateService;
  let policiesFacadeServiceMock: PoliciesFacadeService;
  const evidence: CombinedEvidenceInstance = {
    evidence_is_beta: true,
    evidence_name: 'some-evidence',
    evidence_service_display_name: 'some-evidence-service-display-name',
    evidence_type: 'DOCUMENT',
  };

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceLabelComponent, SearchableTextComponent, GapMarkComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        TranslateService,
        {
          provide: SearchInstancesManagerService,
          useValue: {
            getSearchScopeKey: () => '',
          },
        },
        {
          provide: EvidenceUserEventService,
          useValue: {},
        },
        {
          provide: PoliciesFacadeService,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(async () => {
    const fakeSearchScopeKey = 'fake-search-key';
    const fakeSearchField = new FormControl();
    const dataSearchMock = {
      searchField: fakeSearchField,
    } as any;
    const searchInstancesManagerServiceMock = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerServiceMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.returnValue(fakeSearchScopeKey);
    searchInstancesManagerServiceMock.getDataSearch = jasmine
      .createSpy('getDataSearch')
      .and.returnValue(of(dataSearchMock));

    policiesFacadeServiceMock = TestBed.inject(PoliciesFacadeService);
    policiesFacadeServiceMock.getPolicy = jasmine.createSpy('getPolicy').and.callFake(() => {});

    translateService = TestBed.inject(TranslateService);
    translateService.get = jasmine.createSpy('get').and.returnValue(of('Beta'));
    fixture = TestBed.createComponent(EvidenceLabelComponent);
    component = fixture.componentInstance;
    component.evidence = evidence;
    component.betaLabel = 'Beta';
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Beta label', () => {
    beforeEach(async () => {
      component.evidence.evidence_is_beta = true;
      fixture.detectChanges();
      await fixture.whenStable();
    });
    it('should be displayed when evidence_is_beta property is true', async () => {

      // Arrange

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const evidenceName = fixture.debugElement.query(By.css('app-searchable-text'))
        .componentInstance as SearchableTextComponent;
      expect(evidenceName.text).toEqual('some-evidence (Beta)');
    });

    beforeEach(async () => {
      component.evidence.evidence_is_beta = false;
      fixture.detectChanges();
      await fixture.whenStable();
    });
    it('should not be displayed when evidence_is_beta property is false', async () => {

      // Arrange
      evidence.evidence_is_beta = false;
      component.evidence = evidence;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const evidenceName = fixture.debugElement.query(By.css('app-searchable-text'))
        .componentInstance as SearchableTextComponent;
      expect(evidenceName.text).toEqual('some-evidence');
    });
  });
});
