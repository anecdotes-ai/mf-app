import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';

export interface GridView {
  header: string[];
  rows: GridRow[];
  rawData: { [key: string]: any[] };
  searchDefinitions: SearchDefinitionModel<any>[];
}

export interface GridRow {
  rowId: any;
  cellsObject: { [key: string]: any };
  simplifiedCellsObject: { [key: string]: string }; // value for each key will be a string (there are cases when data can contain arrays instead)
  cells: any[];
}
