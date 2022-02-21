import {
  AfterViewInit, ChangeDetectorRef, Component,
  ElementRef, HostBinding,
  HostListener,
  Injector,
  Input,
  OnChanges, QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { toKeyValueArray } from 'core/utils';
import { AbstractValueAccessor, MakeProvider } from 'core/modules/form-controls';

@Component({
  selector: 'app-multi-dropdown-control',
  templateUrl: './multi-dropdown-control.component.html',
  styleUrls: ['./multi-dropdown-control.component.scss'],
  providers: [MakeProvider(MultiDropdownControlComponent)],
})
export class MultiDropdownControlComponent<TData = any>
  extends AbstractValueAccessor
  implements OnChanges, AfterViewInit {
  private openableElementElementRef: ElementRef<HTMLElement>;
  private previousVisibleItemsCount: number;

  @ViewChildren('openableElement', { read: ElementRef })
  private openableElementQueryList: QueryList<ElementRef<HTMLElement>>;

  @HostBinding('class.disabled')
  private get disabled(): boolean {
    return this.isDisabled || !this.data;
  }

  readonly checkboxHeight: number = 40;
  displayedData: TData[];
  isDropdownOpened = false;
  searchField = new FormControl('');
  dictionary: { [key: string]: boolean } = {};

  get listWidth(): number {
    return this.isDropdownOpened ? this.hostElementRef.nativeElement.getBoundingClientRect().width : 0;
  }

  get listMaxHeight(): number {
    if (this.previousVisibleItemsCount !== this.visibleItemsCount) {
      return this.visibleItemsCount * this.checkboxHeight;
    }

    return this.previousVisibleItemsCount;
  }

  get selectedItems(): TData[] {
    return Object.entries(this.dictionary)
      .filter(([_, checked]) => !!checked)
      .map(([itemId]) => this.getItemById(itemId));
  }

  get selectedItemsString(): string {
    return this.selectedItems.join('; ');
  }

  @Input()
  data: TData[];

  @Input()
  displaySelectedItemsList = true;

  @Input()
  displayValueSelector: (x: TData) => string;

  @Input()
  idSelector: (x: TData) => string;

  @Input()
  context: any;

  @Input()
  titleTranslationKey: string;

  @Input()
  placeholderTranslationKey: string;

  @Input()
  searchEnabled = false;

  @Input()
  required: boolean;

  @Input()
  searchFieldPlaceholder: string;

  @Input()
  visibleItemsCount = 4;

  constructor(
    injector: Injector,
    private translate: TranslateService,
    private hostElementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      this.displayedData = this.data;
    }
  }

  ngAfterViewInit(): void {
    this.openableElementQueryList.notifyOnChanges();

    this.openableElementQueryList.changes
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => (this.openableElementElementRef = this.openableElementQueryList.first));
  }

  writeValue(value: any[]): void {
    if (value && value.forEach) {
      value.forEach((item) => {
        this.dictionary[this.getItemId(item)] = true;
      });
      this.cd.detectChanges();
    }
  }

  search(searchValue: string): void {
    this.displayedData = this.data.filter((item) => {
      const itemLabel = this.getDisplayValue(item);
      return this.translate.instant(itemLabel).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    });
  }

  getDisplayValue(item: TData): string {
    if (item) {
      return this.displayValueSelector ? this.displayValueSelector(item) : item.toString();
    }
  }

  getItemId(item: TData): string {
    if (item) {
      return this.idSelector ? this.idSelector(item) : item.toString();
    }
  }

  uncheckItem(item: TData): void {
    delete this.dictionary[this.getItemId(item)];
    this.updateData();
  }

  searchFieldClick($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  toggleDropdown(): void {
    this.markAsDirty();
    if (this.isDropdownOpened) {
      this.close();
    } else {
      this.open();
    }
  }

  updateData(): void {
    const keyValueArray = toKeyValueArray(this.dictionary).filter((keyValue) => keyValue.value);

    if (this.value?.length !== keyValueArray.length) {
      const res = keyValueArray.map((keyValue) => {
        return this.data.find((item) => this.getItemId(item) === keyValue.key);
      });
      this.value = res.length ? res : null;
    }

    const newValuesSet = keyValueArray.map((keyValue) => keyValue.key);
    const existingValuesSet = new Set(this.value?.map((v) => this.getItemId(v)));

    if (newValuesSet.some((key) => !existingValuesSet.has(key))) {
      const res = keyValueArray.map((keyValue) => {
        return this.data.find((item) => this.getItemId(item) === keyValue.key);
      });
      this.value = res.length ? res : null;
    }
  }

  close(): void {
    this.isDropdownOpened = false;
  }

  @HostListener('window:mousedown', ['$event'])
  private windowClick(mouseEvent: MouseEvent): void {
    // Handles outside clicks to close dropdown
    if (
      this.isDropdownOpened &&
      !mouseEvent
        .composedPath()
        .some((x) => x === this.hostElementRef.nativeElement || x === this.openableElementElementRef.nativeElement)
    ) {
      this.close();
    }
  }

  private open(): void {
    this.isDropdownOpened = true;
  }

  private getItemById(id: string): TData {
    return this.data.find((item) => this.getItemId(item) === id);
  }
}
