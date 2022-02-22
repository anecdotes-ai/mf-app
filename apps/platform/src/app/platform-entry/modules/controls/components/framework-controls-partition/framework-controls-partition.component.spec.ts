import { ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataFilterManagerService, FilterDefinition } from 'core/modules/data-manipulation/data-filter';
import {
  DataSearchComponent,
  SearchInstancesManagerService,
  SearchResultsPaginationComponent,
} from 'core/modules/data-manipulation/search';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { CalculatedControl, ResourceType } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { CategoriesFacadeService, ControlsFacadeService, SnapshotsFacadeService } from 'core/modules/data/services';
import { LoaderManagerService, MessageBusService } from 'core/services';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { ControlContextService } from 'core/modules/shared-controls';
import { ControlFilterObject } from '../../models';
import { FrameworkControlsPartitionComponent } from './framework-controls-partition.component';
import { CommentingResourceModel, CommentPanelManagerService } from 'core/modules/commenting';
import { AuthService, UserFacadeService} from 'core/modules/auth-core/services';
import { FormControl } from '@angular/forms';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { delayedPromise } from 'core/utils';
import { ControlsForFilteringProvider } from '../../services';

describe('FrameworkControlsPartitionComponent', () => {
  configureTestSuite();

  let componentUnderTest: FrameworkControlsPartitionComponent;
  let fixture: ComponentFixture<FrameworkControlsPartitionComponent>;

  let messageBusService: MessageBusService;

  let loaderManagerService: LoaderManagerService;

  let filterManagerService: DataFilterManagerService;
  let setFilterDefinitionSpy: jasmine.Spy<jasmine.Func>;

  let searchInstancesManagerServiceMock: SearchInstancesManagerService;
  let fakeSearchScopeKey: string;
  let dataSearchMock: DataSearchComponent;
  let controlsFacadeMock: ControlsFacadeService;
  let searchResultsPaginator: SearchResultsPaginationComponent;
  let controlContext: ControlContextService;
  let commentPanelManagerServiceMock: CommentPanelManagerService;
  let userFacadeService: UserFacadeService;
  let authService: AuthService;
  let controlsForFilteringProviderMock: ControlsForFilteringProvider;
  let isCommentingOpen: boolean;

  const controlsByFramework = {
    [AnecdotesUnifiedFramework.framework_id]: [
      { control_id: '123', control_name: '123', control_category: 'category_1' },
      { control_id: '456', control_name: '456', control_category: 'category_1' },
      { control_id: '789', control_name: '789', control_category: 'category_2' },
    ],
    'some-other-framework': [
      { control_id: '123', control_name: '123', control_category: '3.5_category_1' },
      { control_id: '456', control_name: '456', control_category: '3.5_category_1' },
      { control_id: '789', control_name: '789', control_category: '2.2_category_2' },
    ],
  };

  let fakeControls: CalculatedControl[];

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FrameworkControlsPartitionComponent, PerfectScrollbarComponent],
        providers: [
          CategoriesFacadeService,
          { provide: DataFilterManagerService, useValue: {} },
          { provide: MessageBusService, useValue: {} },
          { provide: LoaderManagerService, useValue: {} },
          { provide: ControlContextService, useValue: {} },
          { provide: SearchInstancesManagerService, useValue: {} },
          { provide: ControlsFacadeService, useValue: {} },
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: UserFacadeService, useValue: {} },
          { provide: SnapshotsFacadeService, useValue: {} },
          { provide: ControlsForFilteringProvider, useValue: {} }
        ],
        imports: [TranslateModule.forRoot(), RouterTestingModule],
      })
        .overrideComponent(FrameworkControlsPartitionComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkControlsPartitionComponent);
    componentUnderTest = fixture.componentInstance;

    // Mock message bus arrangement
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    // Mock loader manager arrangement
    loaderManagerService = TestBed.inject(LoaderManagerService);
    loaderManagerService.show = jasmine.createSpy('show');

    // Mock filter manager arrangement
    filterManagerService = TestBed.inject(DataFilterManagerService);
    filterManagerService.setFilterDefinition = setFilterDefinitionSpy = jasmine.createSpy('setFilterDefinition');
    filterManagerService.close = jasmine.createSpy('close');
    filterManagerService.reset = jasmine.createSpy('reset');
    filterManagerService.refreshFilter = jasmine.createSpy('refreshFilter');
    filterManagerService.open = jasmine.createSpy('open');
    filterManagerService.getDataFilterEvent = jasmine.createSpy('getDataFilterEvent').and.returnValue(of([]));
    filterManagerService.setData = jasmine.createSpy('setData');
    filterManagerService.resetField = jasmine.createSpy('resetField');
    filterManagerService.setFilterDefinition = setFilterDefinitionSpy = jasmine.createSpy('setFilterDefinition');

    componentUnderTest.framework = AnecdotesUnifiedFramework;
    dataSearchMock = {
      search: new EventEmitter(),
      searchField: new FormControl(''),
      get inputtedText(): string {
        return this.searchField.value;
      },
    } as any;
    fakeSearchScopeKey = 'fake-search-key';
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
    loaderManagerService.hide = jasmine.createSpy('hide');

    controlContext = TestBed.inject(ControlContextService);
    controlContext.clearAllNewEntities = jasmine.createSpy('clearAllNewEntities').and.callThrough();

    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    fakeControls = controlsByFramework[AnecdotesUnifiedFramework.framework_id];
    controlsForFilteringProviderMock = TestBed.inject(ControlsForFilteringProvider);
    controlsForFilteringProviderMock.getControlsForFiltering = jasmine.createSpy('getControlsForFiltering').and.callFake(() => of(fakeControls));
    controlsFacadeMock.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFrameworkId')
      .and.callFake(() => of(fakeControls));
    commentPanelManagerServiceMock = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerServiceMock.open = jasmine.createSpy('open');
    commentPanelManagerServiceMock.close = jasmine.createSpy('close');
    commentPanelManagerServiceMock.destroy = jasmine.createSpy('destroy');
    commentPanelManagerServiceMock.isOpen = jasmine.createSpy('isOpen').and.callFake(() => of(isCommentingOpen));
    commentPanelManagerServiceMock.init = jasmine.createSpy('setResources');
    userFacadeService = TestBed.inject(UserFacadeService);
    userFacadeService.getUsers = jasmine.createSpy('getUsers').and.callFake(() =>
      of([
        {
          email: 'testEmail',
        },
        {
          email: 'testEmail2',
        },
      ])
    );
    authService = TestBed.inject(AuthService);
    authService.getUserAsync = jasmine.createSpy('getUserAsync');

    isCommentingOpen = false;
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('search functionality', () => {
    it('should get search scope key by native element', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getSearchScopeKey).toHaveBeenCalledWith(
        fixture.debugElement.nativeElement
      );
    });

    it('should get data search by search scope key', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getDataSearch).toHaveBeenCalledWith(fakeSearchScopeKey);
    });
  });

  describe('#ngOnInit', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await componentUnderTest.focusAsync();
    });

    it('should show not found screen only when there is no data to display and searchField === true', fakeAsync(() => {
      // Arrange
      const data = [];

      // Act
      dataSearchMock.searchField.setValue('some-search');
      dataSearchMock.search.emit(data);
      fixture.detectChanges();
      fixture.whenStable();
      tick(100);

      // Assert
      const notFoundScreen = fixture.debugElement.query(By.css('app-not-found'));
      expect(notFoundScreen).toBeTruthy();
    }));
  });

  describe('#ngAfterViewInit', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await componentUnderTest.focusAsync();
    });

    it('should emit controlsLoaded if isNotFound is true', fakeAsync(() => {
      // Arrange
      const data = [];
      spyOn(componentUnderTest.controlsLoaded, 'emit');

      // Act
      dataSearchMock.search.emit(data);
      fixture.detectChanges();
      fixture.whenStable();
      tick(100);

      // Assert
      expect(componentUnderTest.controlsLoaded.emit).toHaveBeenCalled();
    }));
  });

  describe('#focusAsync', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it(
      'should set filtering definition on first controls observable emit',
      waitForAsync(async () => {
        // Arrange
        componentUnderTest.framework = AnecdotesUnifiedFramework;

        // Act
        await componentUnderTest.focusAsync();
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(filterManagerService.setFilterDefinition).toHaveBeenCalled();
        expect(filterManagerService.setFilterDefinition).not.toHaveBeenCalledWith(null);
      })
    );

    it(
      'should open filter panel on data filter event',
      waitForAsync(async () => {
        // Act
        fixture.detectChanges();
        await fixture.whenStable();
        await componentUnderTest.focusAsync();
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(filterManagerService.open).toHaveBeenCalled();
      })
    );

    it(
      'should call filterManager setData method on every controls$ emit with proper values',
      waitForAsync(async () => {
        // Arrange
        componentUnderTest.framework = AnecdotesUnifiedFramework;
        const controlsFilteredAndMapped = [
          { control_id: '123', control_name: '123', control_category: 'category_1' },
          { control_id: '456', control_name: '456', control_category: 'category_1' },
          { control_id: '789', control_name: '789', control_category: 'category_2' },
        ];

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        await componentUnderTest.focusAsync();

        // Assert
        expect(filterManagerService.setData).toHaveBeenCalledWith(controlsFilteredAndMapped);
      })
    );

    describe('filtering definition', () => {
      beforeEach(async () => {
        componentUnderTest.framework = AnecdotesUnifiedFramework;
        fixture.detectChanges();
        await fixture.whenStable();
        await componentUnderTest.focusAsync();
      });

      it('should properly set categories filter', () => {
        // Arrange
        const controlFilterObject = { control_category: 'some-category' } as ControlFilterObject;

        // Assert
        const filteringDefinition: FilterDefinition<ControlFilterObject>[] = setFilterDefinitionSpy.calls.mostRecent()
          .args[0];
        const categoriesFilterDefinitionActual = filteringDefinition.find((d) => d.fieldId === 'categories');

        expect(categoriesFilterDefinitionActual.translationKey).toEqual('controls.categories.tab');
        expect(categoriesFilterDefinitionActual.fieldId).toEqual('categories');
        expect(categoriesFilterDefinitionActual.singleSelection).toBeTrue();
        expect(categoriesFilterDefinitionActual.useSort).toBeUndefined();
        expect(categoriesFilterDefinitionActual.customSortCallback).toBeUndefined();
        expect(categoriesFilterDefinitionActual.multiSelector).toBeUndefined();
        expect(categoriesFilterDefinitionActual.iconTemplate).toBeUndefined();
        expect(categoriesFilterDefinitionActual.options).toBeUndefined();
        expect(categoriesFilterDefinitionActual.displayed).toBeFalse();
        expect(categoriesFilterDefinitionActual.isSwitcher).toBeUndefined();
        expect(categoriesFilterDefinitionActual.ignoreForCounting).toBeUndefined();
        expect(categoriesFilterDefinitionActual.ignoreForReset).toBeTrue();
        expect(categoriesFilterDefinitionActual.propertySelector(controlFilterObject)).toEqual(
          controlFilterObject.control_category
        );
      });
    });
  });

  describe('#resetControlsFilters', () => {
    it('should call reset on dataSearchComponent', async () => {
      // Act
      dataSearchMock.reset = jasmine.createSpy('reset');
      searchInstancesManagerServiceMock.getDataSearch = jasmine
        .createSpy('dataSearchMock')
        .and.returnValue(of(dataSearchMock));
      fixture.detectChanges();
      await fixture.whenStable();
      await componentUnderTest.focusAsync();

      componentUnderTest.resetControlsFilters();

      // Assert
      expect(dataSearchMock.reset).toHaveBeenCalled();
    });
  });

  describe('interaction with commenting system', () => {
    const fakeFramework: Framework = { framework_id: 'fake-framework-id', framework_name: 'farmework name' };
    let usersToReturn: User[];

    beforeEach(() => {
      userFacadeService.getUsers = jasmine.createSpy('getUsers').and.callFake(() => of(usersToReturn));
      componentUnderTest.framework = fakeFramework;
    });

    describe('users init', () => {
      const auditorThatHasAccessToFramework: User = {
        role: RoleEnum.Auditor,
        audit_frameworks: [fakeFramework.framework_id],
      };
      const auditorWithNoAccessToFramework: User = { role: RoleEnum.Auditor, audit_frameworks: ['someframeworkid'] };
      const collaborator: User = { role: RoleEnum.Collaborator };
      const admin: User = { role: RoleEnum.Admin };

      describe('when users match filter', () => {
        [
          { user: admin },
          { user: collaborator },
          { user: auditorThatHasAccessToFramework, description: 'that has access to framework' },
        ].forEach((testCase) => {
          it(`should pass users with '${testCase.user.role}' ${testCase.description}`, async () => {
            // Arrange
            usersToReturn = [testCase.user];

            // Act
            fixture.detectChanges();
            await componentUnderTest.focusAsync();
            dataSearchMock.search.next([]);
            await delayedPromise(100);

            // Assert
            expect(commentPanelManagerServiceMock.init).toHaveBeenCalledWith(
              jasmine.anything(),
              jasmine.arrayContaining([testCase.user]),
              jasmine.anything()
            );
          });
        });
      });

      describe('when users don`t match filter', () => {
        [
          ...[RoleEnum.It, RoleEnum.User, RoleEnum.Zone]
            .map((role) => ({ role: role } as User))
            .map((user) => ({ user, description: '' })),
          { user: auditorWithNoAccessToFramework, description: 'that don`t not have access to framework' },
        ].forEach((testCase) => {
          it(`should not pass users with '${testCase.user.role}' ${testCase}`, async () => {
            // Arrange
            usersToReturn = [testCase.user];

            // Act
            fixture.detectChanges();
            await componentUnderTest.focusAsync();
            dataSearchMock.search.next([]);
            await delayedPromise(100);

            // Assert
            expect(commentPanelManagerServiceMock.init).not.toHaveBeenCalledWith(
              jasmine.anything(),
              jasmine.arrayContaining([testCase.user]),
              jasmine.anything()
            );
          });
        });
      });
    });

    describe('resources init', () => {
      it('should pass resources in the same order as controls', async () => {
        // Arrange
        const fakeControls: CalculatedControl[] = [
          { control_id: 'fake-10', control_name: 'fake-name-10', control_calculated_requirements: [] },
          { control_id: 'fake-3', control_name: 'fake-name-3', control_calculated_requirements: [] },
          { control_id: 'fake-4', control_name: 'fake-name-4', control_calculated_requirements: [] },
        ];
        const expectedResources: CommentingResourceModel[] = fakeControls.map((control) => ({
          resourceType: ResourceType.Control,
          resourceId: control.control_id,
          resourceTypeDisplayName: 'commenting.resourceNames.control',
          resourceDisplayName: control.control_name,
          logData: { 'control name': control.control_name },
          extraParams: { frameworkName: fakeFramework.framework_name, path: [fakeFramework.framework_name, control.control_name]  },
        }));
        usersToReturn = [];

        // Act
        fixture.detectChanges();
        await componentUnderTest.focusAsync();
        dataSearchMock.search.next(fakeControls);
        await delayedPromise(100);

        // Assert
        expect(commentPanelManagerServiceMock.init).toHaveBeenCalledWith(expectedResources, jasmine.anything(), jasmine.anything());
      });

      it('should pass common log data', async () => {
        const fakeControls: CalculatedControl[] = [];
        usersToReturn = [];

        // Act
        fixture.detectChanges();
        await componentUnderTest.focusAsync();
        dataSearchMock.search.next(fakeControls);
        await delayedPromise(100);

        // Assert
        expect(commentPanelManagerServiceMock.init).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), { 'framework name': fakeFramework.framework_name });
      });
    });
  });
});
