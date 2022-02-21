import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DataSearchComponent, SearchResultsPaginationComponent } from '../../components';

@Injectable()
export class SearchInstancesManagerService {
  private dataSearchesDictionary: {
    [skopeKey: string]: DataSearchComponent;
  } = {};

  private searchPaginatorDictionary: {
    [skopeKey: string]: SearchResultsPaginationComponent;
  } = {};

  private dataSearchesEventSubject: BehaviorSubject<any>;
  private searchPaginatorEventSubject: BehaviorSubject<any>;

  constructor() {
    this.dataSearchesEventSubject = new BehaviorSubject<any>(this.dataSearchesDictionary);
    this.searchPaginatorEventSubject = new BehaviorSubject<any>(this.searchPaginatorDictionary);
  }

  getSearchScopeKey(current: HTMLElement): string {
    return current.closest('[x-search-scope]')?.attributes.getNamedItem('x-search-scope')?.value;
  }

  getDataSearch(scopeKey: string): Observable<DataSearchComponent> {
    return this.dataSearchesEventSubject.pipe(
      map((x) => x[scopeKey]),
      distinctUntilChanged()
    );
  }

  getSearchResultsPaginator(scopeKey: string): Observable<SearchResultsPaginationComponent> {
    return this.searchPaginatorEventSubject.pipe(
      map((x) => x[scopeKey]),
      distinctUntilChanged()
    );
  }

  addDataSearch(scopeKey: string, instance: DataSearchComponent): void {
    this.dataSearchesDictionary[scopeKey] = instance;
    this.dataSearchesEventSubject.next(this.dataSearchesDictionary);
  }

  addSearchResultsPaginator(scopeKey: string, instance: SearchResultsPaginationComponent): void {
    this.searchPaginatorDictionary[scopeKey] = instance;
    this.searchPaginatorEventSubject.next(this.searchPaginatorDictionary);
  }

  removeDataSearch(scopeKey: string): void {
    delete this.dataSearchesDictionary[scopeKey];
    this.dataSearchesEventSubject.next(this.dataSearchesDictionary);
  }

  removeSearchResultsPaginator(scopeKey: string): void {
    delete this.searchPaginatorDictionary[scopeKey];
    this.searchPaginatorEventSubject.next(this.searchPaginatorDictionary);
  }
}
