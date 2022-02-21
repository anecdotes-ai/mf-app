import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  HostBinding,
  Input,
  KeyValueDiffers,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DynamicFormGroup } from '../../models';
import { isDynamicControl, isDynamicFormGroup, isTemplateModel } from '../../utils';

/**
 * A component for rendering form based on @class DynamicFormGroup
 */
@Component({
  selector: 'app-dynamic-form-outlet',
  templateUrl: './dynamic-form-outlet.component.html',
  styleUrls: ['./dynamic-form-outlet.component.scss'],
})
export class DynamicFormOutletComponent implements OnInit, OnChanges, DoCheck, AfterViewInit {
  @ViewChild('defaultControlWrapper')
  private defaultControlWrapper: TemplateRef<any>;
  @ViewChild('defaultTemplateWrapper')
  private defaultTemplateWrapper: TemplateRef<any>;
  @ViewChild('formGroupTemplate')
  private formGroupTemplate: TemplateRef<any>;

  @HostBinding('class.hidden')
  private get isHidden(): boolean {
    return !this.dynamicFormGroup || !this.dynamicFormGroup.displayed;
  }

  private differ = this.differs.find({}).create();
  private _controlWrappers: any;
  private templatesExist: boolean;

  /**
   * A form model that is rendered @instance DynamicFormGroup
   */
  @Input()
  dynamicFormGroup: DynamicFormGroup<any>;

  /**
   * An object that describes templates which control to be wrapped by custom template
   */
  @Input()
  controlWrappers: { [key: string]: TemplateRef<any> };

  /**
   * Form body that is built based on FormGroup
   */
  formBody = [];

  constructor(private differs: KeyValueDiffers, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.templatesExist = true;
    setTimeout(() => {
      // it's required since sometimes ngAfterViewInit acts before ngDoCheck and due to that form body is not rendered
      this.buildFormBodyIfItemsChanged();
      this.cd.detectChanges();
    }, 0);
  }

  ngOnInit(): void {
    this.refreshControlWrappers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('controlWrappers' in changes) {
      this.refreshControlWrappers();
      this.buildFormBody();
    }
  }

  trackByFn(_, obj: { trackBy: any }): void {
    return obj.trackBy;
  }

  ngDoCheck(): void {
    this.buildFormBodyIfItemsChanged();
  }

  private buildFormBodyIfItemsChanged(): void {
    if (this.dynamicFormGroup instanceof DynamicFormGroup && this.templatesExist) {
      const diff = this.differ.diff(this.dynamicFormGroup.items);

      if (diff) {
        this.buildFormBody();
      }
    } else {
      this.formBody = [];
    }
  }

  private refreshControlWrappers(): void {
    this._controlWrappers = this.controlWrappers ? this.controlWrappers : {};
  }

  private buildFormBody(): void {
    this.formBody = Object.keys(this.dynamicFormGroup.items)
      .map((key) => {
        const item = this.dynamicFormGroup.items[key];
        const wrapper = this._controlWrappers[key];

        if (isDynamicControl(item)) {
          const template = wrapper ? wrapper : this.defaultControlWrapper;
          return {
            instance: item,
            trackBy: item,
            template: template,
            context: { control: item, name: key },
          };
        } else if (isTemplateModel(item)) {
          return {
            instance: item,
            trackBy: item.templateRef,
            template: this.defaultTemplateWrapper,
            context: { templateModel: item },
          };
        } else if (isDynamicFormGroup(item)) {
          return {
            instance: item,
            trackBy: item,
            template: wrapper ? wrapper : this.formGroupTemplate,
            context: { formModel: item, name: key },
          };
        }
      })
      .filter((t) => t);
  }
}
