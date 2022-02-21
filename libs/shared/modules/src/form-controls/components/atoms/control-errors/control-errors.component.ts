import { Component, HostBinding, Input, OnChanges, Optional, SimpleChanges, TemplateRef } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

const defaultErrors = {
  required: 'formControlErrors.required',
  email: 'formControlErrors.wrongEmailFormat',
  emailNotFound: 'formControlErrors.emailNotFound',
  url: 'formControlErrors.url',
  duplicate: 'formControlErrors.duplication',
  json: 'formControlErrors.json'
};

@Component({
  selector: 'app-control-errors',
  templateUrl: './control-errors.component.html'
})
export class ControlErrorsComponent implements OnChanges {
  @HostBinding('class')
  private classes = 'inline font-main text-sm text-error';

  get control(): AbstractControl {
    return this.ngControl?.control;
  }

  @Input()
  errorTexts: object;
  resolvedErrorTexts: object;

  constructor(@Optional() private ngControl: NgControl) {}

  ngOnChanges(changes: SimpleChanges): void {
    if('errorTexts' in changes) {
      this.resolvedErrorTexts = { ...defaultErrors };

      if(this.errorTexts) {
        this.resolvedErrorTexts = { ...this.resolvedErrorTexts, ...this.errorTexts };
      }
    }
  }

  buildErrorTexts(): (string | TemplateRef<any> | any)[] {
    if (this.resolvedErrorTexts && this.control && this.control.errors) {
      return Object.keys(this.control.errors).map((errorKey) => {
        const propValue = this.resolvedErrorTexts[errorKey];

        if (typeof propValue === 'function') {
          return propValue();
        } else {
          return propValue;
        }
      });
    }

    return null;
  }

  isErrorTextTemplateRef(errText: any): boolean {
    return errText instanceof TemplateRef;
  }
}
