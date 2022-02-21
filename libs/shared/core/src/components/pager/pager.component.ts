import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { splitArray } from '../../utils';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerComponent implements OnChanges {
  @HostBinding('class.multipage')
  private multipage: boolean;

  @Input()
  data: any[] = [];

  @Input()
  itemsPerPage = 8;

  @Input()
  template: TemplateRef<any>;

  pages: any[][] = [];
  currentPageIndex = 0;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data) {
      this.currentPageIndex = 0;
      this.pages = splitArray(this.data, this.itemsPerPage);
      this.multipage = this.pages.length > 1;
    }
  }

  goToPage(page: number): void {
    this.currentPageIndex = page;
    this.cd.detectChanges();
  }
}
