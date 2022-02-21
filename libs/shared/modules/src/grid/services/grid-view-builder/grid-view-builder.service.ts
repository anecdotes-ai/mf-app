import { Injectable } from '@angular/core';
import { splitArray, toKeyValueArray } from 'core/utils';
import { GridRow, GridView } from '../../models';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';

@Injectable()
export class GridViewBuilderService {
  buildGridView(data: { [key: string]: (string | string[] | any[])[] }): GridView {
    const dict = toKeyValueArray(data); // get keyvalue pairs where key is property name and value is property value
    const filteredHeaderValues = dict.filter((x) => x.key || (!x.key && (x.value as []).length));
    const header = filteredHeaderValues.map((x) => x.key); // take property names as columns. Each property name is column name. Count of properties equal to columns number
    const rows: (string | string[])[] = [];

    if (dict.length) {
      dict[0].value.forEach((_, i) => rows.push(...dict.map((y) => this.makeCellFlat(y.value[i])))); // split rows by columns
    }

    const displayedRows = splitArray(rows, header.length).map((cells, rowIndex) => {
      const result: GridRow = { rowId: rowIndex, cellsObject: {}, simplifiedCellsObject: {}, cells };

      cells.forEach((cell, index) => {
        result.cellsObject[header[index]] = cell;
        result.simplifiedCellsObject[header[index]] = Array.isArray(cell) ? cell.join(' ') : cell;
      });

      return result;
    });

    const isEmpty = !rows.filter((x) => x.length).length;
    return {
      header,
      rows: isEmpty ? [] : displayedRows,
      rawData: data,
      searchDefinitions: this.buildSearchDefinition(header),
    };
  }

  private makeCellFlat(cell: string | any[]): any[] {
    if (Array.isArray(cell)) {
      return cell.reduce((prev, current) => {
        return [...prev, ...this.makeCellFlat(current)];
      }, []);
    }

    return [cell];
  }

  private buildSearchDefinition(header: string[]): SearchDefinitionModel<any>[] {
    return header.map((headerKey) => ({
      propertySelector: (obj: GridRow) => obj.simplifiedCellsObject[headerKey],
    }));
  }
}
