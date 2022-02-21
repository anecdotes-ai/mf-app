import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionDetacher } from 'core/utils';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchOverlap, SearchOverlapsFoundEvent, SearchDefinitionModel } from '../../models';
import { SearchInstancesManagerService } from '../../services';
import { MessageBusService, SearchMessageBusMessages } from 'core/services';
import { distinct, escapeRegexString, groupBy } from 'core/utils';
import { TextFieldComponent } from 'core/modules/form-controls/components';

const debounceTimeInMS = 500;

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  private _data: any[];
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  @ViewChild('textfield', { static: true })
  private inputComponent: TextFieldComponent;
  private currentSearchScopeKey: string;

  searchField = new FormControl('');

  @Input()
  searchDefinitions: SearchDefinitionModel<any>[] = [];

  @Input()
  placeholderTranslationKey: string;

  @Input()
  get data(): any[] {
    return this._data;
  }
  set data(v: any[]) {
    if (v !== this._data) {
      this._data = v;
      this.searchData();
    }
  }

  @Output()
  search = new EventEmitter();

  @Output()
  inputText = new EventEmitter<InputEvent>();

  @Output()
  overlapsFound = new EventEmitter<SearchOverlapsFoundEvent>();

  @Input()
  routeParamsDisabled: boolean;

  get inputtedText(): string {
    return this.searchField.value;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private messageBusService: MessageBusService,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.currentSearchScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);
    this.searchInstancesManagerService.addDataSearch(this.currentSearchScopeKey, this);
    fromEvent(document, 'keydown')
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(this.handleSearchKeysCombination.bind(this));

    this.messageBusService
      .getObservable(SearchMessageBusMessages.CLEAR_SEARCH, this.currentSearchScopeKey)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => {
        this.reset();
      });
  }

  ngAfterViewInit(): void {
    this.searchField.valueChanges
      .pipe(debounceTime(debounceTimeInMS), this.detacher.takeUntilDetach())
      .subscribe(this.valueChange.bind(this));

    this.inputComponent.input
      .pipe(debounceTime(debounceTimeInMS), this.detacher.takeUntilDetach())
      .subscribe((inputEvent) => this.inputText.emit(inputEvent as InputEvent));

    if (!this.routeParamsDisabled && this.router.routerState.snapshot.root.queryParams['searchQuery']) {
      this.searchField.setValue(this.router.routerState.snapshot.root.queryParams['searchQuery']);
    }
  }

  ngOnDestroy(): void {
    this.searchInstancesManagerService.removeDataSearch(this.currentSearchScopeKey);
    this.detacher.detach();
  }

  valueChange(event: Event): void {
    this.searchData();
    if (!this.routeParamsDisabled) {
      const queryParams = { ...this.router.routerState.snapshot.root.queryParams };

      if (this.searchField.value) {
        queryParams['searchQuery'] = this.searchField.value;
      } else {
        delete queryParams['searchQuery'];
      }

      this.router.navigate([], { queryParams });
    }
  }

  reset(): void {
    this.searchField.reset();
    this.searchData();
    this.cd.detectChanges();
  }

  private handleSearchKeysCombination(event: KeyboardEvent): void {
    // Handles CTRL+F
    if (event.key === 'f' && (event.ctrlKey || event.metaKey)) {
      this.inputComponent.focus();

      event.preventDefault();
      event.stopPropagation();
    }
  }

  private searchData(): void {
    let foundData = this.data;
    let searchOverlaps: SearchOverlap[] = [];
    let searchTextLowercase: string;
    const text: string = this.searchField.value;

    if (text && this.data) {
      searchTextLowercase = escapeRegexString(text).toLocaleLowerCase();
      const filtered = this.searchDefinitions.map((t) =>
        this.data
          .filter((value) => t.propertySelector(value))
          .map((d) => ({
            regExpMatch: t.propertySelector(d).toLocaleLowerCase().match(new RegExp(searchTextLowercase, 'g')),
            object: d,
          }))
      );

      const reduced = filtered.reduce((p, c) => p.concat(c), []).filter((x) => x.regExpMatch?.length);

      searchOverlaps = groupBy(reduced, (x) => x.object).map(
        (matches) =>
          ({
            overlapsCount: this.sum(matches.values.map((x) => x.regExpMatch.length)),
            object: matches.key,
          } as SearchOverlap)
      );
      foundData = distinct(reduced.map((x) => x.object));
    }

    this.overlapsFound.emit(new SearchOverlapsFoundEvent(searchOverlaps));
    this.search.emit(foundData || []);

    // Seems like it's not needed anymore
    this.messageBusService.sendMessage<string>(
      SearchMessageBusMessages.SEARCH_TEXT_CHANGED,
      searchTextLowercase,
      this.currentSearchScopeKey
    );
  }

  private sum(numbers: number[]): number {
    return numbers.reduce((prvs, crnt) => prvs + crnt, 0);
  }
}
