import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';
import { allPluginsTabId, PluginFamily, PluginsComponent } from './plugins.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { InitServicesStateAction, ServiceSelectors, DataFeatureState } from 'core/modules/data/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  RouterExtensionService,
  LoaderManagerService,
  MessageBusService,
  IntercomService,
  WindowHelperService
} from 'core/services';
import { NgVarDirective, UserEventDirective } from 'core/modules/directives';
import { FilterTabModel } from 'core/modules/data-manipulation/data-filter';
import { Observable, of } from 'rxjs';
import { Service } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { toDictionary } from 'core/utils';
import { Dictionary } from '@ngrx/entity';
import { ServiceStoreEntity } from 'core/modules/data/store/reducers';
import { By } from '@angular/platform-browser';
import { DataSearchComponent, SearchInstancesManagerService, SearchScopeDirective } from 'core/modules/data-manipulation/search';
import { RouterTestingModule } from '@angular/router/testing';
import { FAVORITE_FAMILY_NAME } from './../../constants/plugins.constants';


@Component({
  selector: 'app-not-found',
  template: '',
})
class NotFoundMockComponent {
  @Output()
  backToAllDataBtnClick = new EventEmitter<any>();

  @Output()
  additionalActionBtnClick = new EventEmitter<any>();

  @Input()
  mainInfoTranslationKey: string;

  @Input()
  userAdviceTranslationKey: string;

  @Input()
  backToAllDataTranslationKey: string;

  @Input()
  additionalActionTranslationKey: string;

  @Input()
  userAdviceDisabled: boolean;

  @Input()
  additionalActionEnabled = false;
}

@Component({
  selector: 'app-data-tabs-select',
  template: '',
})
class DataTabsSelectMockComponent {
  @Input()
  tabs: FilterTabModel[] = [];

  @Input()
  selectedTabId: any;

  @Input()
  disableTabOnNoItems: boolean;

  @Input()
  trackQueryParams: boolean;

  @Input()
  queryParamId: string;

  @Input()
  chooseFirstTab: boolean;

  @Input()
  defaultTabId: string;

  @Output()
  select = new EventEmitter<FilterTabModel>(true);
  selectTab = jasmine.createSpy('selectTab');
}

@Component({
  selector: 'app-plugins-header',
  template: '',
})
class PluginsHeaderMockComponent {
  @Output()
  search = new EventEmitter<Service[]>();
  @Output()
  searchInputText = new EventEmitter<InputEvent>();
  @Output()
  suggestPlugin = new EventEmitter();

  @Input()
  plugins: Service[];
}

describe('PluginsComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<PluginsComponent>;
  let component: PluginsComponent;
  let mockStore: MockStore<DataFeatureState>;
  let fakePlugins: Service[];
  let loaderManager: LoaderManagerService;
  let messageBus: MessageBusService;
  let dataSearchComponentMock: DataSearchComponent;


  let gcpPlugin: Service;
  let githubPlugin: Service;
  let jiraPlugin: Service;
  let favoritePlugin: Service;


  const firstServiceFamily = 'firstServiceFamily';
  const secondServiceFamily = 'secondServiceFamily';
  const thirdServicefamily = 'thirdServicefamily';


  function getHeaderComponent(): PluginsHeaderMockComponent {
    return fixture.debugElement.query(By.directive(PluginsHeaderMockComponent)).componentInstance;
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getDataSelectComponent(): DataTabsSelectMockComponent {
    return fixture.debugElement.query(By.directive(DataTabsSelectMockComponent))?.componentInstance;
  }

  beforeAll(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore(),
        MessageBusService,
        { provide: LoaderManagerService, useValue: {} },
        {
          provide: WindowHelperService,
          useValue: {
            openUrlInNewTab: jasmine.createSpy('openUrlInNewTab'),
            getWindow: jasmine.createSpy('getWindow').and.returnValue({
              document: window.document,
              localStorage: { getItem: jasmine.createSpy('getItem') },
            }),
          },
        },
        { provide: RouterExtensionService, useValue: {} },
        { provide: IntercomService, useValue: {} },
        { provide: SearchInstancesManagerService, useValue: {} },
      ],
      declarations: [
        NgVarDirective,
        NotFoundMockComponent,
        UserEventDirective,
        PluginsComponent,
        PluginsHeaderMockComponent,
        DataTabsSelectMockComponent,
        SearchScopeDirective,
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    })
      .overrideComponent(PluginsComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    loaderManager = TestBed.inject(LoaderManagerService);
    loaderManager.hide = jasmine.createSpy('hide');
    loaderManager.show = jasmine.createSpy('show');
    messageBus = TestBed.inject(MessageBusService);
    messageBus.sendMessage = jasmine.createSpy('sendMessage');
    fixture = TestBed.createComponent(PluginsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as MockStore;
    gcpPlugin = { service_id: 'gcp', service_families: [secondServiceFamily] };
    githubPlugin = { service_id: 'github', service_families: [firstServiceFamily] };
    jiraPlugin = { service_id: 'jira', service_families: [firstServiceFamily] };
    favoritePlugin = { service_id: 'favorite', service_is_favorite: true, service_families: [thirdServicefamily] };

    fakePlugins = [githubPlugin, jiraPlugin, gcpPlugin, favoritePlugin];

    const pluginsDictionary = toDictionary(
      fakePlugins,
      (x) => x.service_id,
      (x) => ({ service: x })
    );

    mockStore.overrideSelector(ServiceSelectors.SelectServiceState, {
      entities: pluginsDictionary as Dictionary<ServiceStoreEntity>,
      ids: fakePlugins.map((x) => x.service_id),
      initialized: true,
    });

    dataSearchComponentMock = {
      search: new EventEmitter(),
    } as DataSearchComponent;
    const service = TestBed.inject(SearchInstancesManagerService);
    service.getDataSearch = jasmine.createSpy('getDataSearch').and.returnValue(of(dataSearchComponentMock));
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('app-data-tabs-select', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should be rendered', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent()).toBeTruthy();
    });

    it('should have chooseFirstTab input set to true', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().defaultTabId).toEqual(allPluginsTabId);
    });

    it('should have trackQueryParams input set to true', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().trackQueryParams).toBeTrue();
    });

    it('should have queryParamId input set to "family"', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().queryParamId).toBe('family');
    });

    it('should have tabs input set to value according to service_family', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().tabs.find((x) => x.tabId === firstServiceFamily)).toBeTruthy();
      expect(getDataSelectComponent().tabs.find((x) => x.tabId === secondServiceFamily)).toBeTruthy();
    });

    it('should be provided with tab according to service_family where count property equals to count of specifc family', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().tabs.find((x) => x.tabId === firstServiceFamily).count).toBe(
        fakePlugins.filter((x) => x.service_families.some((f) => f === firstServiceFamily)).length
      );
    });

    it('should be provided with FAVORITE_FAMILY_NAME tab as first element of tabs', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().tabs.findIndex((x) => x.tabId === FAVORITE_FAMILY_NAME)).toBe(0);
    });

    it('should be provided with all_plugins tab as second element of tabs', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().tabs.findIndex((x) => x.tabId === allPluginsTabId)).toBe(1);
    });

    it('should be provided with all_plugins tab where count property equals to count all plugins', () => {
      // Arrange
      // Act
      // Assert
      expect(getDataSelectComponent().tabs.find((x) => x.tabId === allPluginsTabId).count).toBe(fakePlugins.length);
    });

    it('should call toggleTab when "select" event is emitted', fakeAsync(() => {
      // Arrange
      const selectedTab: FilterTabModel = {
        tabId: firstServiceFamily,
        filterDefinitionValue: firstServiceFamily,
        a: 'b',
      } as any;
      spyOn(component, 'toggleTab');

      // Act
      getDataSelectComponent().select.emit(selectedTab);
      tick();

      // Assert
      expect(component.toggleTab).toHaveBeenCalledWith(selectedTab);
    }));
  });

  describe('app-plugins-header', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    function getPluginsHeaderComponent(): PluginsHeaderMockComponent {
      return fixture.debugElement.query(By.directive(PluginsHeaderMockComponent))?.componentInstance;
    }

    it('should be rendered', () => {
      // Arrange
      // Act
      // Assert
      expect(getPluginsHeaderComponent()).toBeTruthy();
    });

    it('should call suggestPlugin() when "suggestPlugin" event is emitted', () => {
      // Arrange
      spyOn(component, 'suggestPlugin');

      // Act
      getPluginsHeaderComponent().suggestPlugin.emit();

      // Assert
      expect(component.suggestPlugin).toHaveBeenCalled();
    });

    it('should call searchInput() when searchInputText event is emitted', () => {
      // Arrange
      spyOn(component, 'searchInput');

      // Act
      getPluginsHeaderComponent().searchInputText.emit();

      // Assert
      expect(component.searchInput).toHaveBeenCalled();
    });
  });

  describe('app-search-results-pagination', () => {
    it('should be rendered next to tabs-wrapper element', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('.tabs-wrapper+app-search-results-pagination'))).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should call loaderManager.show()', () => {
      // Arrange
      // Act
      component.ngOnInit();

      // Assert
      expect(loaderManager.show).toHaveBeenCalled();
    });

    it('should dispatch InitServicesStateAction', () => {
      // Arrange
      spyOn(mockStore, 'dispatch');

      // Act
      component.ngOnInit();

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new InitServicesStateAction());
    });

    it('should set isNotFoundState$ with observable', () => {
      // Arrange
      // Act
      component.ngOnInit();

      // Assert
      expect(component.isNotFoundState$).toBeInstanceOf(Observable);
    });
  });

  describe('isNotFoundState$', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should return true if there is no plugins found', (done) => {
      component.isNotFoundState$.subscribe((actualValue) => {
        // Assert
        expect(actualValue).toBeTruthy();
        done();
      });

      // Arrange
      const emptyPluginsArray: Service[] = [];

      // Act
      dataSearchComponentMock.search.emit(emptyPluginsArray);
    });

    it('should return false if plugins found', (done) => {
      component.isNotFoundState$.subscribe((actualValue) => {
        // Assert
        expect(actualValue).toBeFalsy();
        done();
      });

      // Arrange
      const emptyPluginsArray: Service[] = fakePlugins;

      // Act
      dataSearchComponentMock.search.emit(emptyPluginsArray);
    });
  });

  describe('clearSearch()', () => {
    it('should send "clear search" message to message bus with appropriate search key', async () => {
      // Arrange
      await detectChanges();
      dataSearchComponentMock.reset = jasmine.createSpy('reset');

      // Act
      component.clearSearch();

      // Assert
      expect(dataSearchComponentMock.reset).toHaveBeenCalled();
    });
  });

  describe('buildTranslationKey()', () => {
    it('should return correct translation key', () => {
      // Arrange
      const relativeKey = 'fake';

      // Act
      const actualKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualKey).toBe(`plugins.${relativeKey}`);
    });
  });

  describe('suggestPlugin()', () => {
    let intercom: IntercomService;

    beforeEach(() => {
      intercom = TestBed.inject(IntercomService);
      intercom.showNewMessage = jasmine.createSpy('showNewMessage');
    });

    it('should call intercom.showNewMessage()', () => {
      // Arrange
      // Act
      component.suggestPlugin();

      // Assert
      expect(intercom.showNewMessage).toHaveBeenCalled();
    });
  });

  describe('toggleTab()', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should set all plugins for filteredPlugins property if allPlugins tab selected', () => {
      // Arrange
      const allPluginsTab: FilterTabModel = {
        tabId: allPluginsTabId,
        filterDefinitionValue: allPluginsTabId,
      };

      // Act
      component.toggleTab(allPluginsTab);

      // Assert
      expect(component.filteredPlugins.length).toBe(fakePlugins.length);
      expect(component.filteredPlugins.find((x) => x.service_id === gcpPlugin.service_id)).toBeTruthy();
      expect(component.filteredPlugins.find((x) => x.service_id === githubPlugin.service_id)).toBeTruthy();
      expect(component.filteredPlugins.find((x) => x.service_id === jiraPlugin.service_id)).toBeTruthy();
    });

    it('should set family specific plugins for filteredPlugins property if family specific tab selected', () => {
      // Arrange
      const familySpecificTab: FilterTabModel = {
        tabId: firstServiceFamily,
        filterDefinitionValue: firstServiceFamily,
      };

      // Act
      component.toggleTab(familySpecificTab);

      // Assert
      expect(component.filteredPlugins.length).toBe(2);
      expect(component.filteredPlugins.find((x) => x.service_id === githubPlugin.service_id)).toBeTruthy();
      expect(component.filteredPlugins.find((x) => x.service_id === jiraPlugin.service_id)).toBeTruthy();
    });

    it('should set favorites plugins for filteredPlugins property if favorite tab is selected', () => {
      // Arrange
      const favoriteTab: FilterTabModel = {
        tabId: FAVORITE_FAMILY_NAME,
        filterDefinitionValue: FAVORITE_FAMILY_NAME,
      };

      // Act
      component.toggleTab(favoriteTab);

      // Assert
      expect(component.filteredPlugins.length).toBe(1);
      expect(component.filteredPlugins.find((x) => x.service_id === favoritePlugin.service_id)).toBeTruthy();
    });
  });

  describe('isPluginHidden()', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should return true for not found plugin', () => {
      // Arrange
      dataSearchComponentMock.search.emit([]);
      // component.search([]);

      // Act
      const isHidden = component.isPluginHidden(fakePlugins[0]);

      // Assert
      expect(isHidden).toBeTrue();
    });

    it('should return false for found plugin', () => {
      // Arrange
      const foundPlugin = fakePlugins[0];
      dataSearchComponentMock.search.emit([foundPlugin]);
      // component.search([foundPlugin]);

      // Act
      const isHidden = component.isPluginHidden(foundPlugin);

      // Assert
      expect(isHidden).toBeFalse();
    });
  });

  describe('isFamilyHidden()', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should return true for not found family', () => {
      // Arrange
      dataSearchComponentMock.search.emit([]);

      // Act
      const isHidden = component.isFamilyHidden({ familyName: firstServiceFamily, plugins: [] });

      // Assert
      expect(isHidden).toBeTrue();
    });

    it('should return false for found family', () => {
      // Arrange
      const foundPlugin = fakePlugins[0];
      dataSearchComponentMock.search.emit([foundPlugin]);

      // Act
      const isHidden = component.isFamilyHidden({ familyName: foundPlugin.service_families[0], plugins: [] });

      // Assert
      expect(isHidden).toBeFalse();
    });

    it('should return true for favorites section if choosed "all plugins"', async () => {
      // Arrange
      const favoritePluginAsDefault = { ...fakePlugins[0], service_is_favorite: true };

      // Set initiate default state
      component.toggleTab({ tabId: 'all', filterDefinitionValue: null });
      dataSearchComponentMock.search.emit([favoritePluginAsDefault]);

      const pluginsDictionary1 = toDictionary(
        [favoritePluginAsDefault, { ...favoritePluginAsDefault, service_id: 'anyOther' }],
        (x) => x.service_id,
        (x) => ({ service: x })
      );

      mockStore.overrideSelector(ServiceSelectors.SelectServiceState, {
        entities: pluginsDictionary1 as Dictionary<ServiceStoreEntity>,
        ids: fakePlugins.map((x) => x.service_id),
        initialized: true,
      });

      mockStore.refreshState();

      dataSearchComponentMock.search.emit([favoritePluginAsDefault, { ...favoritePluginAsDefault, service_id: 'anyOther' }]);
      await detectChanges();

      // Act
      const isHidden = component.isFamilyHidden({ familyName: FAVORITE_FAMILY_NAME, plugins: [favoritePluginAsDefault] });

      // Assert
      expect(isHidden).toBeTruthy();
    });

  });

  describe('searchInput()', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should select allPlugins tab when current tab is not allPlugins tab', () => {
      // Arrange
      const notAllPluginsTab: FilterTabModel = {
        tabId: firstServiceFamily,
        filterDefinitionValue: firstServiceFamily,
      };
      component.toggleTab(notAllPluginsTab);

      // Act
      component.searchInput();

      // Assert
      expect(getDataSelectComponent().selectTab).toHaveBeenCalledWith(allPluginsTabId);
    });

    it('should not select allPlugins tab when current tab is allPlugins tab', () => {
      // Arrange
      const allPluginsTab: FilterTabModel = {
        tabId: allPluginsTabId,
        filterDefinitionValue: allPluginsTabId,
      };
      component.toggleTab(allPluginsTab);

      // Act
      component.searchInput();

      // Assert
      expect(getDataSelectComponent().selectTab).not.toHaveBeenCalled();
    });
  });

  describe('pluginTrackByWithIndex()', () => {
    it('should return service_id', () => {
      // Arrange
      const plugin: Service = { service_id: 'fale_id' };

      // Act
      const actual = component.pluginTrackByWithIndex(0, plugin);

      // Assert
      expect(actual).toBe(plugin.service_id);
    });
  });

  describe('familyTrackBy()', () => {
    it('should return familyNname', () => {
      // Arrang
      const family: PluginFamily = { familyName: 'fake_family_name', plugins: [] };

      // Act
      const actual = component.familyTrackByWithIndex(0, family);

      // Assert
      expect(actual).toBe(family.familyName);
    });
  });

  describe('app-not-found', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    function getNotFoundComponent(): NotFoundMockComponent {
      return fixture.debugElement.query(By.directive(NotFoundMockComponent))?.componentInstance;
    }

    it('should not be rendered when plugins found', async () => {
      // Arrange
      // Act
      dataSearchComponentMock.search.emit(fakePlugins);
      await detectChanges();

      // Assert
      expect(getNotFoundComponent()).toBeFalsy();
    });

    describe('when no plugins found', () => {
      beforeEach(async () => {
        dataSearchComponentMock.search.emit([]);
        await detectChanges();
      });

      it('should be rendered when no plugins found', async () => {
        // Arrange
        // Act
        // Assert
        expect(getNotFoundComponent()).toBeTruthy();
      });

      it('should call clearSearch() when backToAllDataBtnClick event is emitted', () => {
        // Arrange
        spyOn(component, 'clearSearch');

        // Act
        getNotFoundComponent().backToAllDataBtnClick.emit();

        // Assert
        expect(component.clearSearch).toHaveBeenCalled();
      });

      it('should call suggestPlugin() when backToAllDataBtnClick event is emitted', () => {
        // Arrange
        spyOn(component, 'suggestPlugin');

        // Act
        getNotFoundComponent().additionalActionBtnClick.emit();

        // Assert
        expect(component.suggestPlugin).toHaveBeenCalled();
      });
    });
  });
});
