import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworksPluginsListComponent } from './frameworks-plugins-list.component';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Service, Framework } from "core/modules/data/models/domain";

const mockFramework: Framework = {
  framework_name: 'fakeFrameworkName',
  framework_id: 'fakeFrameworkId',
  framework_excluded_plugins: {},
};

const mockFrameworkId = 'fakeFrameworkId';

const mockFilteredPluginsList: Service[] = [
  {
    service_display_name: 'mockServiceName1',
    service_id: 'mockServiceId1',
  },
  {
    service_display_name: 'mockServiceName2',
    service_id: 'mockServiceId2',
  },
];

describe('FrameworksPluginsListComponentComponent', () => {
  configureTestSuite();
  let component: FrameworksPluginsListComponent;
  let fixture: ComponentFixture<FrameworksPluginsListComponent>;
  let frameworksFacade: FrameworksFacadeService;
  let componentSwitcherDirectiveMock: ComponentSwitcherDirective;
  let frameworksPluginsListSearch;
  let controlsFacadeMock: ControlsFacadeService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [FrameworksPluginsListComponent],
      providers: [
        {
          provide: FrameworksFacadeService,
          useValue: {},
        },
        {
          provide: ControlsFacadeService,
          useValue: {},
        },        {
          provide: ComponentSwitcherDirective,
          useValue: {},
        },
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworksPluginsListComponent);
    component = fixture.componentInstance;
    component.frameworkId = mockFrameworkId;
    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    componentSwitcherDirectiveMock = TestBed.inject(ComponentSwitcherDirective);
    componentSwitcherDirectiveMock.goById = jasmine.createSpy('goById');
    frameworksFacade.getFrameworkById = jasmine.createSpy('getFrameworkById').and.callFake(() => of(mockFramework));
    frameworksFacade.updateFrameworkWithExcludedPlugins = jasmine.createSpy().and.returnValue(Promise.resolve());
    frameworksPluginsListSearch = fixture.nativeElement.querySelector('app-frameworks-plugins-list-search');
    frameworksPluginsListSearch.foundPlugins$ = of([...mockFilteredPluginsList]);
    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeMock.reloadControls = jasmine.createSpy('reloadControls');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    // Arrange
    // Act
    detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should trigger controls reloading on destroy', () => {
    // Arrange
    // Act
    fixture.destroy();

    // Assert
    expect(controlsFacadeMock.reloadControls).toHaveBeenCalled();
  });
});
