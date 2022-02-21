import { async, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CalculatedControl } from 'core/modules/data/models';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { ControlsFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { CategoriesFacadeService } from './categories-facade.service';

describe('CategoriesFacadeService', () => {
  let service: CategoriesFacadeService;
  let controlsFacadeMock: ControlsFacadeService;
  let fakeControls: CalculatedControl[];

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: ControlsFacadeService, useValue: {} },
        CategoriesFacadeService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CategoriesFacadeService);
    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    fakeControls = controlsByFramework[AnecdotesUnifiedFramework.framework_id];
    controlsFacadeMock.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFrameworkId')
      .and.callFake(() => of(fakeControls));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('group categories', () => {
    it('should group controls by categories and NOT sort categories if framework is anecdotes', async(async () => {
      // Arrange
      const framework = AnecdotesUnifiedFramework;
      const groupedControlsByCategory = [
        {
          control_category: 'category_1',
          control_category_id: undefined,
          controls: [
            { control_id: '123', control_category: 'category_1', control_name: '123' },
            { control_id: '456', control_category: 'category_1', control_name: '456' },
          ],
        },
        {
          control_category: 'category_2',
          control_category_id: undefined,
          controls: [{ control_id: '789', control_category: 'category_2', control_name: '789' }],
        },
      ];

      // Act
      const result = await service.getFrameworkCategories(framework.framework_id).toPromise();

      // Assert
      expect(result).toEqual(groupedControlsByCategory);
    }));

    it('should group controls by categories', async(async () => {
      // Arrange
      fakeControls = controlsByFramework['some-other-framework'];
      const framework = { framework_id: 'some-other-framework', framework_name: 'some-other-framework' };
      const groupedControlsByCategory = [
        {
          control_category: '3.5_category_1',
          control_category_id: 3.5,
          controls: [
            { control_id: '123', control_category: '3.5_category_1', control_name: '123' },
            { control_id: '456', control_category: '3.5_category_1', control_name: '456' },
          ],
        },
        {
          control_category: '2.2_category_2',
          control_category_id: 2.2,
          controls: [{ control_id: '789', control_category: '2.2_category_2', control_name: '789' }],
        },
      ];

      // Act
      const result = await service.getFrameworkCategories(framework.framework_id).toPromise();
      // Assert
      expect(result).toEqual(groupedControlsByCategory);
    }));
  });
});
