import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponent } from './tabs.component';
import { TabModel } from '../../types';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let routerMock: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TabsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    routerMock = TestBed.inject(Router);
    routerMock.isActive = jasmine.createSpy('isActive').and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should set tabsToDisplay if tabs is in changes', () => {
      // Arrange
      const tabs = [{ tabId: 1 }, { tabId: 2 }, { tabId: 3 }];
      const changes: SimpleChanges = {
        tabs: {
          previousValue: undefined,
          firstChange: true,
          currentValue: tabs,
          isFirstChange: () => true,
        },
      };
      component.tabs = tabs;

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(component.tabsToDisplay).toEqual(tabs);
    });

    it('should set multiple-tabs class to host if tabs is in changes and tabs length is bigger than 1', () => {
      // Arrange
      const tabs = [{ tabId: 1 }, { tabId: 2 }, { tabId: 3 }];
      const changes: SimpleChanges = {
        tabs: {
          previousValue: undefined,
          firstChange: true,
          currentValue: tabs,
          isFirstChange: () => true,
        },
      };
      component.tabs = tabs;

      // Act
      component.ngOnChanges(changes);
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.nativeElement.classList.contains('multiple-tabs')).toBeTruthy();
    });

    it('should set selectedTabIndex if selectTabById is in changes', () => {
      // Arrange
      const tabs = [{ tabId: 2 }, { tabId: 12345 }, { tabId: 3 }];
      const selectTabById = 12345;
      const changes: SimpleChanges = {
        selectTabById: {
          previousValue: undefined,
          firstChange: true,
          currentValue: selectTabById,
          isFirstChange: () => true,
        },
      };
      component.tabs = tabs;
      component.selectTabById = selectTabById;

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(component.selectedTabIndex).toEqual(1);
    });
  });

  describe('#tabTrackBy', () => {
    it('should correctly return tabId from tabTrackBy', () => {
      // Arrange
      const tabs = [{ tabId: 2 }, { tabId: 1 }, { tabId: 3 }];

      // Act
      const actual = component.tabTrackBy(undefined, tabs[1]);

      // Assert
      expect(actual).toEqual(tabs[1].tabId);
    });
  });

  describe('#selectTab', () => {
    it('should emit tabChange with correct selected tabId', () => {
      // Arrange
      const tabs = [{ tabId: 2 }, { tabId: 1 }, { tabId: 3 }];
      component.tabs = tabs;
      spyOn(component.tabChange, 'emit');

      // Act
      component.selectTab(2);

      // Assert
      expect(component.tabChange.emit).toHaveBeenCalledWith(tabs[2].tabId);
    });

    it('should not emit tabChange if passed index equal current selectedTabIndex', () => {
      // Arrange
      component.selectedTabIndex = 2;
      spyOn(component.tabChange, 'emit');

      // Act
      component.selectTab(2);

      // Assert
      expect(component.tabChange.emit).not.toHaveBeenCalled();
    });

    it('should assign passed index to selectedTabIndex', () => {
      // Arrange
      const tabs = [{ tabId: 2 }, { tabId: 1 }, { tabId: 3 }];
      component.tabs = tabs;

      // Act
      component.selectTab(2);

      // Assert
      expect(component.selectedTabIndex).toEqual(2);
    });
  });

  describe('tabSize input', () => {
    it('should be equal to medium by default', () => {
      // Arrange
      // Act
      // Assert
      expect(component.tabSize).toBe('medium');
    });
  });

  describe('synchronization with router', () => {
    it('should call router.isActive with routerLink property from tabs', () => {
      // Arrange
      const expectedRouterLink = 'fake-router/link';
      const expectedTab = { tabId: 12345, routerLink: expectedRouterLink  };
      const tabs: TabModel[] = [{ tabId: 2, }, expectedTab, { tabId: 3 }];
      routerMock.isActive = jasmine.createSpy('isActive').and.returnValue(true);
      const changes: SimpleChanges = {
        tabs: {
          previousValue: undefined,
          firstChange: true,
          currentValue: tabs,
          isFirstChange: () => true,
        },
      };
      component.tabs = tabs;
      component.selectTab = jasmine.createSpy('selectTab');

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(routerMock.isActive).toHaveBeenCalledOnceWith(expectedRouterLink, { paths: 'exact', queryParams: 'exact', matrixParams: 'exact', fragment: 'exact' });
      expect(component.selectTab).toHaveBeenCalledWith(1);
    });
  });
});
