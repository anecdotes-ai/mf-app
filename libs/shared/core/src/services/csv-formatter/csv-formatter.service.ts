import { Injectable } from '@angular/core';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class CsvFormatterService {
  createCsvBlob(rows: any[][], headers?: string[]): Blob {
    const headersString = `${headers?.join(',')}\n`;
    const dataString = rows.map((row) => this.processRow(row)).join('\n');
    const csvString = headers?.length ? headersString + dataString : dataString;
    return new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  }

  private processRow(cells: any[]): string {
    return cells
      .map((cell) => cell || '')
      .map((cell) => (cell instanceof Date ? cell.toLocaleString() : cell.toString()))
      .map((cell) => cell.replace(/"/g, '""').replace(/\n/g, ' '))
      .map((cell) => (cell.search(/("|,|-)/g) >= 0 ? `"${cell}"` : cell))
      .join(',');
  }
}
