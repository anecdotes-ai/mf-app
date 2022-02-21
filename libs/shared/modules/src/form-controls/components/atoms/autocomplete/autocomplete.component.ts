import {
  AfterViewInit,
  ChangeDetectorRef, Component,
  ElementRef,
  EventEmitter, Input,
  OnDestroy,
  Output, ViewChild
} from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { fromEvent } from 'rxjs';

const sidePaddingPx = 8;

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements AfterViewInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild(PerfectScrollbarComponent)
  private perfectScrollBar: PerfectScrollbarComponent;

  private get isAutocompleteDataProvided(): boolean {
    return this.autocompleteData?.length > 0;
  }

  @Input()
  private inputElement: ElementRef<HTMLInputElement>;

  @Input()
  private autocompleteData: string[];

  @Input()
  private maxItemsToDisplay: number;

  @Output()
  select: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('customMenuContent')
  private customMenuContentElement: ElementRef<HTMLElement>;

  @ViewChild('customMenuContent') set customMenuContentSetter(menuElement: ElementRef<HTMLElement>) {
    if (menuElement && menuElement.nativeElement) {
      menuElement.nativeElement.style.padding = `${sidePaddingPx}px`;

      if (this.maxItemsToDisplay) {
        this.calculatedMaxMenuHeight = this.getMenuItemMaxHeight(menuElement.nativeElement);
        this.prepareComponentPartsStyling(menuElement);
      }
    } else {
      this.calculatedMaxMenuHeight = '100%';
    }
  }

  matchedSuggestions: string[];

  focusedSuggestionIndex: number;

  calculatedMaxMenuHeight: string;

  get isAutocompleteDisplayed(): boolean {
    return this.matchedSuggestions?.length > 0;
  }

  constructor(private cd: ChangeDetectorRef, private hostElementRef: ElementRef) {
    this.focusedSuggestionIndex = -1;
  }

  ngAfterViewInit(): void {
    if (this.inputElement && this.isAutocompleteDataProvided) {
      fromEvent(this.inputElement.nativeElement, 'keydown')
        .pipe(this.detacher.takeUntilDetach())
        .subscribe(this.suggestionListKeyHandler.bind(this));

      fromEvent(this.inputElement.nativeElement, 'keyup')
        .pipe(this.detacher.takeUntilDetach())
        .subscribe(this.getSuggestions.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  outsideClickHandler($event: Event): void {
    if (!this.hostElementRef.nativeElement.contains($event.target)) {
      this.closeSuggestionList();
    }
  }

  selectSuggestion(suggestion: string): void {
    this.select.emit(suggestion);
    this.closeSuggestionList();
  }

  private getMenuItemMaxHeight(element: HTMLElement, addPadding = true): string {
    const menuElementHeight = (element.querySelectorAll('.custom-menu-item')[0] as HTMLElement).clientHeight;

    if (!menuElementHeight) {
      return null;
    }

    let resultMaxHeight = menuElementHeight * this.maxItemsToDisplay;
    if (addPadding) {
      resultMaxHeight = resultMaxHeight + sidePaddingPx * 2;
    }

    return resultMaxHeight + 'px';
  }

  private suggestionListKeyHandler($event: KeyboardEvent): void {
    if ($event.key === 'ArrowDown') {
      $event.preventDefault();
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      if (this.focusedSuggestionIndex < this.matchedSuggestions.length - 1) {
        this.focusedSuggestionIndex++;
        const selector = `#option${this.focusedSuggestionIndex}`;

        this.perfectScrollBar.directiveRef.scrollToElement(selector);
      }
    } else if ($event.key === 'ArrowUp') {
      $event.preventDefault();
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      if (this.focusedSuggestionIndex) {
        this.focusedSuggestionIndex--;
        const selector = `#option${this.focusedSuggestionIndex}`;
        this.perfectScrollBar.directiveRef.scrollToElement(selector);
      }
    } else if ($event.key === 'Enter') {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      $event.preventDefault();
      if (this.focusedSuggestionIndex >= 0 && this.matchedSuggestions && this.matchedSuggestions.length) {
        this.selectSuggestion(this.matchedSuggestions[this.focusedSuggestionIndex]);
      }
    }
    this.cd.detectChanges();
  }

  private getSuggestions($event: KeyboardEvent): void {
    // Prevent refreshMatchedSuggestions if next button's are pressed
    if ($event.key === 'Enter' || $event.key === 'ArrowUp' || $event.key === 'ArrowDown') {
      return;
    }

    this.matchedSuggestions = this.autocompleteData.filter((suggestion) =>
      suggestion.match(new RegExp(`^${this.inputElement.nativeElement.value}`, 'i'))
    );
    this.focusedSuggestionIndex = -1;
    this.prepareComponentPartsStyling(this.customMenuContentElement);
    this.cd.detectChanges();
  }

  private prepareComponentPartsStyling(element: ElementRef<HTMLElement>): void {
    if (element && element.nativeElement) {
      const perfectBar = element.nativeElement.querySelector('perfect-scrollbar') as HTMLElement;
      const psContentElement = perfectBar.querySelector('.ps-content') as HTMLElement;
      if (this.maxItemsToDisplay && this.matchedSuggestions.length > this.maxItemsToDisplay) {
        const limitMaxHeight = this.getMenuItemMaxHeight(element.nativeElement, false);
        perfectBar.style.maxHeight = limitMaxHeight;

        psContentElement.style.paddingRight = sidePaddingPx * 2 + 'px';
      } else {
        perfectBar.style.maxHeight = '100%';
        psContentElement.style.paddingRight = '0';
      }
    }
  }

  private closeSuggestionList(): void {
    this.focusedSuggestionIndex = 0;
    this.matchedSuggestions = [];
  }
}
