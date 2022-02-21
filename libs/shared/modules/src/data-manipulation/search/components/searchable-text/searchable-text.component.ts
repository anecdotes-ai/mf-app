import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { escapeRegexString, SubscriptionDetacher } from 'core/utils';
import { Subject } from 'rxjs';
import { filter, startWith, } from 'rxjs/operators';
import { SearchInstancesManagerService } from '../../services';

@Component({
  selector: 'app-searchable-text',
  templateUrl: './searchable-text.component.html',
  styleUrls: ['./searchable-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableTextComponent implements OnInit, OnDestroy, OnChanges {
  @HostBinding('class.in-focus')
  private isInFocus: boolean;
  private currentScopeKey: string;

  @Input() text: string;

  textWithHighlights: string;
  searchText: string;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private scopeDetacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Output()
  focusLeave = new EventEmitter(true);

  @Output()
  focusIn = new EventEmitter(true);

  constructor(
    private cd: ChangeDetectorRef,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('text' in changes && !changes.text.isFirstChange()) {
      this.updateHighlights();
    }
  }

  ngOnInit(): void {
    this.currentScopeKey = this.searchInstancesManagerService.getSearchScopeKey(this.elementRef.nativeElement);


    this.searchInstancesManagerService
        .getDataSearch(this.currentScopeKey)
        .pipe(
          filter(() => !!this.text),
          filter((x) => !!x),
          this.scopeDetacher.takeUntilDetach()
        )
        .subscribe((component) => {
          component.searchField.valueChanges
            .pipe(startWith(component.inputtedText), this.detacher.takeUntilDetach())
            .subscribe((text) => {
              this.searchText = text;
              this.updateHighlights();
              this.cd.detectChanges();
            });
        });

  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.scopeDetacher.detach();
  }

  private updateHighlights(): void {
    if (!this.searchText) {
      this.textWithHighlights = this.text;
      return;
    }

    const regex = new RegExp(escapeRegexString(this.searchText), 'gi');
    const match = this.text.match(regex);

    if (!match) {
      this.textWithHighlights = this.text;
      return;
    }

    this.textWithHighlights = this.text.replace(regex, `<span class='search-highlight'>${match[0]}</span>`);
  }

  @HostListener('focusTerm')
  private onFocus(): void {
    this.isInFocus = true;
    this.cd.detectChanges();
    this.focusIn.emit();
  }

  @HostListener('focusTermRemoved')
  private onFocusLeave(): void {
    delete this.isInFocus;
    this.cd.detectChanges();
    this.focusLeave.emit();
  }
}
