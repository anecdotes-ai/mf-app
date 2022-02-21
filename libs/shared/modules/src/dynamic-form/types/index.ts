import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { AbstractDynamicControl, TemplateModel } from '../models';

export declare type ControlOrTemplate = AbstractDynamicControl<any> | TemplateModel<any>;

/**
 * The interface for configuring AbstractDynamicControl
 */
export declare interface ControlConfiguration<TInputs, TOutputs extends OutputsObject, TValue> {
  /**
   * Initial state for inputs being binded to control component (@Input() directive over a component prop)
   */
  initialInputs?: TInputs;

  /**
   * Function callbacks that're going to be called when some of an output will be emitted (@Output() directive over a component prop)
   */
  outputs?: TOutputs;

  /**
   * Validator functions (from Reactive Forms)
   */
  validators?: ValidatorFn | ValidatorFn[];

  /**
   * Async validator functions (from Reactive Forms)
   */
  asyncValidators?: AsyncValidatorFn[] | AsyncValidatorFn;

  /**
   * Determines whether control is displayed in a DynamicFormGroup or not
   */
  displayed?: boolean;

  /**
   * An initial value for a control
   */
  initialValue?: TValue;
}

/**
 * The interface for outputs
 */
export declare interface OutputsObject {
  [key: string]: () => any;
}
