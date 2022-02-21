import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TabModel } from 'core/modules/dropdown-menu';
import { FilterTabModel } from 'core/modules/data-manipulation/data-filter';
import { configureTestSuite } from 'ng-bullet';

import { DataTabsSelectComponent } from './data-tabs-select.component';

@Component({
  selector: 'app-tabs',
})
class TabsMockComponent {
  @Input()
  tabProgressDisplay = false;

  @Input()
  allowTabTemplates = true;

  @Input()
  selectTabById: number;

  @Input()
  disableTabsOnNoItems: boolean;

  @Input()
  tabs: TabModel[] = [];

  @Output()
  tabChange = new EventEmitter<number | string>();
}

@Component({
  selector: 'app-host',
  template: `
    <app-data-tabs-select
      [tabs]="tabs"
      [selectedTabId]="selectedTabId"
      [disableTabOnNoItems]="disableTabOnNoItems"
      [trackQueryParams]="trackQueryParams"
      [queryParamId]="queryParamId"
      [chooseFirstTab]="chooseFirstTab"
      (select)="select($event)"
    ></app-data-tabs-select>
  `,
})
class HostComponent {
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

  select = jasmine.createSpy('select');
}

describe('DataTabsSelectComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let componentUnderTest: DataTabsSelectComponent;
  let fixture: ComponentFixture<HostComponent>;
  let router: Router;

  function getTabsComponent(): TabsMockComponent {
    return fixture.debugElement.query(By.directive(TabsMockComponent))?.componentInstance;
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataTabsSelectComponent, TabsMockComponent, HostComponent],
      providers: [{ provide: Router, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(DataTabsSelectComponent))?.componentInstance;
    router = TestBed.inject(Router);
    componentUnderTest.tabs = [{ filterDefinitionValue: '' }, { filterDefinitionValue: '' }];
    router.navigate = jasmine.createSpy('navigate');
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  it('should render tabs component', async () => {
    // Act
    await detectChanges();

    // Assert
    expect(getTabsComponent()).toBeTruthy();
  });

  it('should pass tabs property to tabs component', async () => {
    // Arrange
    const tabs = [];
    hostComponent.tabs = tabs;

    // Act
    await detectChanges();

    // Assert
    expect(getTabsComponent().tabs).toBe(tabs);
  });

  it('should set allowTabTemplates to false for tabs component', async () => {
    // Arrange
    // Act
    await detectChanges();

    // Assert
    expect(getTabsComponent().allowTabTemplates).toBe(false);
  });

  describe('when chooseFirstTab is true', () => {
    let firstTab = { filterDefinitionValue: '' };

    beforeEach(() => {
      hostComponent.chooseFirstTab = true;
      firstTab = { filterDefinitionValue: '' };
      hostComponent.tabs = [firstTab, ...hostComponent.tabs];
    });

    it('should select first tab', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.currentTab).toBe(firstTab);
    });

    it('should emit select event', async () => {
      // Arrange
      spyOn(componentUnderTest.select, 'emit');

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.select.emit).toHaveBeenCalledWith(firstTab);
    });
  });

  describe('when chooseFirstTab is false', () => {
    beforeEach(() => {
      hostComponent.chooseFirstTab = false;
    });

    it('should not select first tab', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.currentTab).toBeFalsy();
    });

    it('should not emit select event', async () => {
      // Arrange
      spyOn(componentUnderTest.select, 'emit');

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.select.emit).not.toHaveBeenCalled();
    });
  });

  describe('selectedTabId input', () => {
    let tabWithId: FilterTabModel;

    beforeEach(() => {
      const tabId = 'fake-tab-id';
      tabWithId = {
        tabId,
        filterDefinitionValue: '',
      };

      hostComponent.tabs = [...componentUnderTest.tabs, tabWithId];
      hostComponent.selectedTabId = tabId;
    });

    it('should set current tab', async () => {
      // Act
      await detectChanges();

      // Arrange
      expect(componentUnderTest.currentTab).toBe(tabWithId);
    });
  });

  describe('ngOnChanges', () => {
    describe('tracking query params', () => {
      let queryParamId: string;
      let firstTab: FilterTabModel;
      let secondTab: FilterTabModel;

      beforeEach(() => {
        queryParamId = 'fakeQueryParamId';
        componentUnderTest.trackQueryParams = true;
        componentUnderTest.queryParamId = queryParamId;
        (firstTab = {
          tabId: 'firstFakeTabId',
          count: 10,
          filterDefinitionValue: 'firstFakeTabId',
        }),
          (secondTab = {
            tabId: 'secondFakeTabId',
            count: 10,
            filterDefinitionValue: 'secondFakeTabId',
          });
        componentUnderTest.tabs = [firstTab, secondTab];
        (router as any).routerState = {
          snapshot: {
            root: {
              queryParams: {
                [queryParamId]: secondTab.filterDefinitionValue,
              },
            },
          },
        };
        spyOn(componentUnderTest.select, 'emit');
      });

      it('should set current tab from queryParams', async () => {
        // Arrange
        // Act
        componentUnderTest.ngOnChanges({
          tabs: new SimpleChange(null, componentUnderTest.tabs, true),
        });

        // Assert
        expect(componentUnderTest.currentTab).toBe(secondTab);
      });

      it('should emit select event with tab found by query param', async () => {
        // Act
        componentUnderTest.ngOnChanges({
          tabs: new SimpleChange(null, componentUnderTest.tabs, true),
        });

        // Assert
        expect(componentUnderTest.select.emit).toHaveBeenCalledWith(secondTab);
      });

      describe('chooseFirstTab is true', () => {
        beforeEach(() => {
          componentUnderTest.chooseFirstTab = true;
          (router as any).routerState = {
            snapshot: {
              root: {
                queryParams: {},
              },
            },
          };
        });

        it('should set currentTab with first tab when query params do not contain tabId', async () => {
          // Arrange
          // Act
          componentUnderTest.ngOnChanges({
            tabs: new SimpleChange(null, componentUnderTest.tabs, true),
          });

          // Assert
          expect(componentUnderTest.currentTab).toBe(firstTab);
        });

        it('should emit select event with first tab', async () => {
          // Arrange
          // Act
          componentUnderTest.ngOnChanges({
            tabs: new SimpleChange(null, componentUnderTest.tabs, true),
          });

          // Assert
          expect(componentUnderTest.select.emit).toHaveBeenCalledWith(firstTab);
        });
      });

      describe('chooseFirstTab is true', () => {
        beforeEach(() => {
          componentUnderTest.chooseFirstTab = false;
          (router as any).routerState = {
            snapshot: {
              root: {
                queryParams: {},
              },
            },
          };
        });

        it('should not set currentTab', async () => {
          // Arrange
          // Act
          componentUnderTest.ngOnChanges({
            tabs: new SimpleChange(null, componentUnderTest.tabs, true),
          });

          // Assert
          expect(componentUnderTest.currentTab).toBeFalsy();
        });

        it('should not emit select event', async () => {
          // Arrange
          // Act
          componentUnderTest.ngOnChanges({
            tabs: new SimpleChange(null, componentUnderTest.tabs, true),
          });

          // Assert
          expect(componentUnderTest.select.emit).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('selectTab', () => {
    let firstTab: FilterTabModel;
    let secondTab: FilterTabModel;

    beforeEach(async () => {
      (firstTab = {
        tabId: 'firstFakeTabId',
        count: 10,
        filterDefinitionValue: 'firstFakeTabId',
      }),
        (secondTab = {
          tabId: 'secondFakeTabId',
          count: 10,
          filterDefinitionValue: 'secondFakeTabId',
        });
      hostComponent.tabs = [firstTab, secondTab];
      spyOn(componentUnderTest.select, 'emit');
      await detectChanges();
    });

    it('should set current tab by tab id', async () => {
      // Arrange
      // Act
      componentUnderTest.selectTab(secondTab.tabId, true);

      // Assert
      expect(componentUnderTest.currentTab).toBe(secondTab);
    });

    it('should emit select event with first tab if emitEvent is true', async () => {
      // Arrange
      const emitEvent = true;

      // Act
      componentUnderTest.selectTab(secondTab.tabId, emitEvent);

      // Assert
      expect(componentUnderTest.select.emit).toHaveBeenCalledWith(secondTab);
    });

    it('should not emit select event when emitEvent is false', async () => {
      // Arrange
      const emitEvent = false;

      // Act
      componentUnderTest.selectTab(secondTab.tabId, emitEvent);

      // Assert
      expect(componentUnderTest.select.emit).not.toHaveBeenCalled();
    });
  });
});
