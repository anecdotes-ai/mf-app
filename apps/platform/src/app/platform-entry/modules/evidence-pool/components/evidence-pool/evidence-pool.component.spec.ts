import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { LoaderManagerService } from 'core';
import { DataSortComponent } from 'core/modules/data-manipulation/sort';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { EvidenceFacadeService } from 'core/modules/data/services/facades/evidences-facade/evidences-facade.service';
import {
  DataSearchComponent,
  SearchInstancesManagerService,
  SearchOverlapsFoundEvent,
  SearchResultsPaginationComponent,
} from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { EvidencePoolSecondaryHeaderComponent } from './../evidence-pool-secondary-header/evidence-pool-secondary-header.component';
import { EvidencePoolComponent } from './evidence-pool.component';
import { take } from 'rxjs/operators';

describe('EvidencePoolComponent', () => {
  configureTestSuite();

  let component: EvidencePoolComponent;
  let fixture: ComponentFixture<EvidencePoolComponent>;

  let loaderManager: LoaderManagerService;
  let searchInstancesManagerServiceMock: SearchInstancesManagerService;
  let fakeSearchScopeKey: string;
  let dataSearchMock: DataSearchComponent;
  let searchResultsPaginator: SearchResultsPaginationComponent;

  let filterManager: DataFilterManagerService;
  let evidenceFacadeService: EvidenceFacadeService;
  let frameworksFacade: FrameworksFacadeService;

  let filteredEvidence;


  const applicableEvidence = [
    { evidence_id: 'evidence_id1', evidence_is_applicable: true },
    { evidence_id: 'evidence_id2', evidence_is_applicable: true },
  ];
  const allCalculatedEvidence = [...applicableEvidence, { evidence_id: 'evidence_id3', evidence_is_applicable: false }];

  let mockEvidence = allCalculatedEvidence;


  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [EvidencePoolComponent, EvidencePoolSecondaryHeaderComponent, DataSortComponent],
      providers: [
        { provide: SearchInstancesManagerService, useValue: {} },
        { provide: LoaderManagerService, useValue: {} },
        { provide: DataFilterManagerService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePoolComponent);
    component = fixture.componentInstance;

    loaderManager = TestBed.inject(LoaderManagerService);
    loaderManager.show = jasmine.createSpy('show');
    loaderManager.hide = jasmine.createSpy('hide');

    fakeSearchScopeKey = 'fake-search-key';
    dataSearchMock = {
      search: new EventEmitter<any>(),
      overlapsFound: new EventEmitter<any>(),
    } as any;
    searchResultsPaginator = {
      dataFocusChange: new EventEmitter<any>(),
    } as any;
    searchInstancesManagerServiceMock = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerServiceMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.returnValue(fakeSearchScopeKey);
    searchInstancesManagerServiceMock.getDataSearch = jasmine
      .createSpy('getDataSearch')
      .and.returnValue(of(dataSearchMock));
    searchInstancesManagerServiceMock.getSearchResultsPaginator = jasmine
      .createSpy('getSearchResultsPaginator')
      .and.returnValue(of(searchResultsPaginator));

    filterManager = TestBed.inject(DataFilterManagerService);
    filterManager.getDataFilterEvent = jasmine.createSpy('getDataFilterEvent').and.callFake(() => of(filteredEvidence));
    filterManager.close = jasmine.createSpy('close');
    filterManager.open = jasmine.createSpy('open');
    filterManager.setFilterDefinition = jasmine.createSpy('setFilterDefinition');
    filterManager.setData = jasmine.createSpy('setData');

    evidenceFacadeService = TestBed.inject(EvidenceFacadeService);
    evidenceFacadeService.getAllCalculatedEvidence = jasmine
      .createSpy('getAllCalculatedEvidence')
      .and.callFake(() => of(mockEvidence));

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getApplicableFrameworks = jasmine.createSpy('getApplicableFrameworks').and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should show loader', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(loaderManager.show).toHaveBeenCalled();
    });
  });

  describe('isOnSearch$', () => {
    it('should return true when overlapsFound emits more than 0 elements', async () => {
      // Arrange
      const items = [{} as any];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      dataSearchMock.overlapsFound.emit(new SearchOverlapsFoundEvent(items));
      const actual = await component.isOnSearch$.pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return false when overlapsFound emits 0 elements', async () => {
      // Arrange
      const emptyArray = [];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      dataSearchMock.overlapsFound.emit(new SearchOverlapsFoundEvent(emptyArray));
      const actual = await component.isOnSearch$.pipe(take(1)).toPromise();

      // Assert
      expect(actual).toBeFalse();
    });
  });

  describe('filtering', () => {
    it('should set filtering definition on first evidence observable emit', async () => {
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(filterManager.setFilterDefinition).toHaveBeenCalled();
      expect(filterManager.setFilterDefinition).not.toHaveBeenCalledWith(null);
    });

    it('should set data to filter manager on handleSort function call', async () => {
      // Act
      fixture.detectChanges();
      component.handleSort(applicableEvidence);
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(filterManager.setData).toHaveBeenCalledWith(applicableEvidence);
    });

    it('should open filter on first filtering', async () => {
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(filterManager.open).toHaveBeenCalled();
    });

    it('should set data to search from filter event', async () => {
      // Arrange
      filteredEvidence = applicableEvidence;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(dataSearchMock.data).toEqual(filteredEvidence);
    });

    describe('searching logic', () => {
      it('should emit true to isNotFoundState$ if no evidences found', async () => {
        // Arrange
        fixture.detectChanges();
        const secondaryHeaderComponent = fixture.debugElement.query(By.directive(EvidencePoolSecondaryHeaderComponent))
          .componentInstance as EvidencePoolSecondaryHeaderComponent;
        const sortedData = applicableEvidence;

        // Act
        fixture.detectChanges();
        await fixture.whenStable();
        secondaryHeaderComponent.sort.emit(sortedData);
        dataSearchMock.search.emit([]);
        dataSearchMock.search.emit([]); // because of skip

        expect(component.isNotFoundState$.getValue()).toBeTrue();
      });

      it('should emit false to isNotFoundState$ if some evidences found', async () => {
        // Arrange
        fixture.detectChanges();
        const secondaryHeaderComponent = fixture.debugElement.query(By.directive(EvidencePoolSecondaryHeaderComponent))
          .componentInstance as EvidencePoolSecondaryHeaderComponent;
        const sortedData = applicableEvidence;

        // Act
        fixture.detectChanges();
        await fixture.whenStable();
        secondaryHeaderComponent.sort.emit(sortedData);
        dataSearchMock.search.emit([sortedData[0]]);

        expect(component.isNotFoundState$.getValue()).toBeFalse();
      });

      it('should not display tip if isEmptyState === true', async () => {
        // Arrange
        mockEvidence = [];
        fixture.detectChanges();

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        //Assert
        const tip = fixture.debugElement.query(By.css('.tip-wrapper'));
        expect(tip).toBeFalsy();
      });

      it('should display tip if isEmptyState === false', async () => {
        // Arrange
        mockEvidence = allCalculatedEvidence;
        fixture.detectChanges();

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        //Assert
        const tip = fixture.debugElement.query(By.css('.tip-wrapper'));
        expect(tip).toBeTruthy();
      });

      it('should display evidence-not-found component if isEmptyState === false', async () => {
        // Arrange
        mockEvidence = [];
        fixture.detectChanges();

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        //Assert
        const emptyState = fixture.debugElement.query(By.css('.evidence-not-found'));
        expect(emptyState).toBeTruthy();
      });

      it('should not display evidence-not-found component if isEmptyState === false', async () => {
        // Arrange
        mockEvidence = allCalculatedEvidence;
        fixture.detectChanges();

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        //Assert
        const emptyState = fixture.debugElement.query(By.css('.evidence-not-found'));
        expect(emptyState).toBeFalsy();
      });
    });
  });
});
