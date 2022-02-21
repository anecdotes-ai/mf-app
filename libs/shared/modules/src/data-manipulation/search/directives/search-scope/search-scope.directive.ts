import { Directive, ElementRef, InjectionToken, Input, OnInit } from '@angular/core';
import { WindowHelperService } from 'core/services';

export const SearchScopeInjectionToken = new InjectionToken('SearchScopeDirective');

@Directive({
  selector: '[searchScope]',
})
export class SearchScopeDirective implements OnInit {
  private static index = 0;

  @Input()
  searchScope: string;

  initializedSearchScope: string;

  constructor(private elementRef: ElementRef<HTMLElement>, private windowHelper: WindowHelperService) {}

  ngOnInit(): void {
    const attribute = this.windowHelper.getWindow().document.createAttribute('x-search-scope');
    this.initializedSearchScope = this.getCurrentSearchScopeName();
    attribute.value = this.initializedSearchScope;
    this.elementRef.nativeElement.attributes.setNamedItem(attribute);
  }

  private getCurrentSearchScopeName(): string {
    if (this.searchScope) {
      return this.searchScope;
    }

    const currentIndex = SearchScopeDirective.index;
    SearchScopeDirective.index++;
    return `SearchScopeKey${currentIndex}`;
  }
}
