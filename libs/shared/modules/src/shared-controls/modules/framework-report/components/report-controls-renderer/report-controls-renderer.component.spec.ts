import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryItem, ReportControlsRendererComponent } from './report-controls-renderer.component';
import { configureTestSuite } from 'ng-bullet';
import { CategoriesFacadeService } from 'core/modules/data/services';
import { CategoryObject } from 'core/modules/data/models';

describe('ReportControlsRendererComponent', () => {
  configureTestSuite();

  let component: ReportControlsRendererComponent;
  let fixture: ComponentFixture<ReportControlsRendererComponent>;

  let categoriesFacade: CategoriesFacadeService;

  const mockData: CategoryObject[] = [
    {
      control_category: '1',
      controls: [{}, {}],
      control_category_id: 1,
    },
    {
      control_category: '2',
      controls: [{}, {}, {}],
      control_category_id: 2,
    },
  ];

  const renderItems = [
    {
      category: '1',
      amount: 2,
    },
    {},
    {},
    {
      category: '2',
      amount: 3,
    },
    {},
    {},
    {},
  ];

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportControlsRendererComponent],
      providers: [{ provide: CategoriesFacadeService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportControlsRendererComponent);
    component = fixture.componentInstance;
    component.framework_id = 'id';

    categoriesFacade = TestBed.inject(CategoriesFacadeService);
    categoriesFacade.groupControlsByCategory = jasmine.createSpy('groupControlsByCategory').and.returnValue(mockData);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if item is category', () => {
    // Arrange
    const testItem: CategoryItem = {
      category: 'category',
      amount: 3,
    };

    // Act
    const result = component.isCategory(testItem);

    // Assert
    expect(result).toBeTrue();
  });

  it('should return appropriate render items', () => {
    // Arrange
    // Act
    const result = component.buildRenderingItems();

    // Assert
    expect(result).toEqual(renderItems);
  });
});
