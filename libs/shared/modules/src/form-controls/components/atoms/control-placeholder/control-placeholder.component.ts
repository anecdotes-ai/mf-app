import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-control-placeholder',
  templateUrl: './control-placeholder.component.html',
  styleUrls: ['./control-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPlaceholderComponent implements OnChanges {
  @HostBinding('class')
  private classes = 'flex justify-between items-center cursor-text font-main text-base text-navy-70 whitespace-nowrap justify-between w-full';
  
  placeholderObj: { type: string; value: string | TemplateRef<any> | any };

  @Input()
  placeholder: string | TemplateRef<any>;

  @Input()
  placeholderParamsObj: any;

  @Input()
  placeholderIcon: string;

  ngOnChanges(simpleChange: SimpleChanges): void {
    if ('placeholder' in simpleChange) {
      if (typeof this.placeholder === 'string') {
        this.placeholderObj = { type: 'string', value: this.placeholder };
      } else {
        this.placeholderObj = { type: 'template', value: this.placeholder };
      }
    }
  }

  isTextPlaceholderType(): boolean {
    return this.placeholderObj.type === 'string';
  }
}
