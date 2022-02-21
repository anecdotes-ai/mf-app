/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GridViewBuilderService } from './grid-view-builder.service';

describe('Service: GridViewBuilder', () => {
  let gridViewBuilderService: GridViewBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridViewBuilderService],
    });
  });

  beforeEach(() => {
    gridViewBuilderService = TestBed.inject(GridViewBuilderService);
  });

  describe('buildGridView', () => {
    describe('GridView.header', () => {
      it('should return GridView with header cells', inject([GridViewBuilderService], () => {
        // Arrange
        const headerValue1 = 'headerValue1';
        const headerValue2 = 'headerValue2';

        const data = {
          [headerValue1]: [],
          [headerValue2]: [],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.header).toEqual([headerValue1, headerValue2]);
      }));
    });

    describe('GridView.rawData', () => {
      it('should return GridView with rawData', inject([GridViewBuilderService], () => {
        // Arrange
        const headerValue1 = 'headerValue1';
        const headerValue2 = 'headerValue2';

        const data = {
          [headerValue1]: [],
          [headerValue2]: [],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.rawData).toEqual(data);
      }));
    });

    describe('GridView.searchDefinitions', () => {
      it('should have search definitions for rows', () => {
        // Arrange
        const headerValue = 'headerValue';
        const hello = 'hello';

        const data = {
          [headerValue]: [hello],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.searchDefinitions[0].propertySelector(gridView.rows[0])).toEqual(hello);
      });
    });

    describe('GridView.rows', () => {
      it('should contain cells that are strings converted to array with 1 element', () => {
        // Arrange
        const headerValue = 'headerValue';
        const hello = 'hello';
        const world = 'world';

        const data = {
          [headerValue]: [hello, world],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.rows).toEqual([
          {
            rowId: 0,
            cellsObject: { [headerValue]: [hello] },
            simplifiedCellsObject: { [headerValue]: hello },
            cells: [[hello]],
          },
          {
            rowId: 1,
            cellsObject: { [headerValue]: [world] },
            simplifiedCellsObject: { [headerValue]: world },
            cells: [[world]],
          },
        ]);
      });

      it('should contain cells that are arrays', () => {
        // Arrange
        const headerValue = 'headerValue';
        const firstArray = ['hello', 'world'];
        const secondArray = ['world', 'hello'];

        const data = {
          [headerValue]: [firstArray, secondArray],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.rows).toEqual([
          {
            rowId: 0,
            cellsObject: { [headerValue]: firstArray },
            simplifiedCellsObject: { [headerValue]: firstArray.join(' ') },
            cells: [firstArray],
          },
          {
            rowId: 1,
            cellsObject: { [headerValue]: secondArray },
            simplifiedCellsObject: { [headerValue]: secondArray.join(' ') },
            cells: [secondArray],
          },
        ]);
      });

      it('should flat cells if they contain arrays', () => {
        // Arrange
        const headerValue = 'headerValue';
        const hello = 'hello';
        const world = 'world';
        const firstArray = [[hello], world];
        const secondArray = [[world], hello];

        const data = {
          [headerValue]: [firstArray, secondArray],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.rows).toEqual([
          {
            rowId: 0,
            cellsObject: { [headerValue]: [hello, world] },
            simplifiedCellsObject: { [headerValue]: [hello, world].join(' ') },
            cells: [[hello, world]],
          },
          {
            rowId: 1,
            cellsObject: { [headerValue]: [world, hello] },
            simplifiedCellsObject: { [headerValue]: [world, hello].join(' ') },
            cells: [[world, hello]],
          },
        ]);
      });

      it('should return empty array in rows if cell contains an empty array', () => {
        // Arrange
        const headerValue = 'headerValue';

        const data = {
          [headerValue]: [[], [], []],
        };

        // Act
        const gridView = gridViewBuilderService.buildGridView(data);

        // Assert
        expect(gridView.rows).toEqual([]);
      });
    });
  });
});
