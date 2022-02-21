import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injector,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AbstractValueAccessor, MakeProvider } from 'core/modules/form-controls';
import { MenuAction } from '../../types';

@Component({
  selector: 'app-dropdown-control',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.scss'],
  providers: [MakeProvider(DropdownControlComponent)],
})

export class DropdownControlComponent extends AbstractValueAccessor implements AfterViewInit {

  @ViewChild('contentContainer')
  private contentContainer: ElementRef<HTMLElement>;

  @HostBinding('class')
  private readonly hostClasses = 'block';

  private openableElementElementRef: ElementRef<HTMLElement>;
  private previousVisibleItemsCount: number;

  @ViewChildren('openableElement', { read: ElementRef })
  private openableElementQueryList: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('trigger', { read: ElementRef })
  private dropdownButton: ElementRef<HTMLElement>;

  @HostBinding('class.disabled')
  private get disabled(): boolean {
    return this.isDisabled || !this.data;
  }

  readonly buttonHeight: number = 40;
  displayedData: any[];
  isDropdownOpened = false;
  searchField = new FormControl('');
  bottomDropdownDisplayed: boolean;
  searchValue: string;

  get listWidth(): number {
    return this.isDropdownOpened
      ? this.listMinWidth || this.dropdownButton.nativeElement.getBoundingClientRect().width
      : 0;
  }

  get listMaxHeight(): number {
    if (this.previousVisibleItemsCount !== this.visibleItemsCount) {
      return this.visibleItemsCount * this.buttonHeight;
    }

    return this.previousVisibleItemsCount;
  }

  get contentExists(): boolean {
    return this.contentContainer && !!this.contentContainer.nativeElement.childNodes.length;
  }

  @Input()
  data: any[];

  @Input()
  displayValueSelector: (x: any) => string;

  @Input()
  disableValueSelector: (x: any) => boolean;

  @Input()
  itemHoverTooltip: {
    displayCondition: (x: any) => boolean;
    templateTooltip: TemplateRef<any>;
  };

  @Input()
  context: any;

  @Input()
  titleTranslationKey: string;

  @Input()
  infoTooltip: string;

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

  @Input()
  overlayPanelClass = 'dropdown-control-overlay';

  @Input()
  comingSoon = false;

  @Input()
  selectFirstValue = true;

  @Input()
  bottomDropdownAction: MenuAction;
  icon: string;

  @Input()
  listMinWidth: number;

  @Input()
  selectedValue: any;

  @Input()
  emptyListPlaceholder = 'core.dropdown.emptyListPlaceholder';

  @Output()
  select = new EventEmitter<any>(true);

  constructor(
    injector: Injector,
    protected translate: TranslateService,
    protected hostElementRef: ElementRef<HTMLElement>,
    protected cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.openableElementQueryList.notifyOnChanges();

    this.openableElementQueryList.changes
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => (this.openableElementElementRef = this.openableElementQueryList.first));
  }

  ngOnInit(): void {
    this.bottomDropdownDisplayed = !this.bottomDropdownAction?.showOnlyOnSearch;

    if (this.bottomDropdownAction?.shouldResetOnClick) {
      const action = this.bottomDropdownAction.action;
      this.bottomDropdownAction.action = (context) => this.handleBottomActionClick(action, context);
    }

    this.searchField.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((v: string) => this.search(v));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      this.displayedData = this.data;

      if (this.selectFirstValue && !this.value && !this.placeholderTranslationKey && this.data.length) {
        this.selectItem(this.data[0]);
      }
    }

    if ('selectFirstValue' in changes && this.selectFirstValue && !this.value && this.data?.length) {
      this.selectItem(this.data[0]);
    }

    if (
      'selectedValue' in changes &&
      this.selectedValue &&
      this.displayedData?.find((value) => this.getDisplayValue(value) === this.getDisplayValue(this.selectedValue))
    ) {
      this.selectItem(
        this.displayedData.find((value) => this.getDisplayValue(value) === this.getDisplayValue(this.selectedValue))
      );
    }
  }

  handleBottomActionClick(action: any, context: any): void {
    action(context);

    this.resetDropdown();
  }

  selectItem(selectedValue: any): void {
    this.value = selectedValue;
    this.select.emit(selectedValue);
    this.resetDropdown();
  }

  resetDropdown(): void {
    this.bottomDropdownDisplayed = false;
    this.searchField.setValue('');
    this.displayedData = this.data;
    this.isDropdownOpened = false;
    this.cd.detectChanges();
  }

  search(searchValue: string): void {
    if (this.bottomDropdownAction?.showOnlyOnSearch) {
      this.bottomDropdownAction.translationKeyParams = { searchValue };
      this.bottomDropdownDisplayed = !!searchValue;
      this.searchValue = searchValue;
    }

    this.displayedData = this.data.filter((item) => {
      const itemLabel = this.getDisplayValue(item);
      return this.translate.instant(itemLabel).toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    });
  }

  getDisplayValue(item: any): string {
    if (item) {
      return this.displayValueSelector ? this.displayValueSelector(item) : item;
    }
    return null;
  }

  getIsValueDisabled(item: any): boolean {
    if (item) {
      return this.disableValueSelector ? this.disableValueSelector(item) : !item;
    }
    return false;
  }

  searchFieldClick($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  toggleDropdown(e: MouseEvent): void {
    if (this.isDropdownOpened) {
      this.close();
    } else {
      this.open();
    }
    e.stopPropagation();
  }

  open(): void {
    this.isDropdownOpened = true;
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
}
