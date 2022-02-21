import { Type } from '@angular/core';
import { ControlValueAccessor, FormControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

import { ControlConfiguration, OutputsObject } from '../../types';

function convertToValidatorsArray<T>(obj: T | T[]): T[] {
  return ((Array.isArray(obj) ? obj : [obj]) as T[]).filter((val) => val);
}

/** Strongly typed dynamic form control */
export abstract class AbstractDynamicControl<
  TControlComponent extends ControlValueAccessor,
  TInputs = any,
  TOutputs extends OutputsObject = any,
  TValue = any
> extends FormControl {
  private _name: string;

  get name(): string {
    return this._name;
  }

  /**
   * Inputs binded to control component (@Input() directive over a component prop)
   */
  public inputs: TInputs;

  /**
   * In other words, events handler for a control's events
   * Function callbacks that're going to be called when some of an output will be emitted (@Output() directive over a component prop)
   */
  public outputs: TOutputs = {} as TOutputs;

  /**
   * Determines whether control is displayed in a DynamicFormGroup or not
   */
  public displayed = true;

  /**@inheritdoc */
  readonly valueChanges: Observable<TValue>;

  /**
   * Constructs DynamicControl
   * @param config Configuration for the control
   * @param componentType Component type is going to be displayed in form renderer
   */
  constructor(
    config: ControlConfiguration<TInputs, TOutputs, TValue>,
    public readonly componentType: Type<TControlComponent>
  ) {
    super(
      config.initialValue,
      convertToValidatorsArray(config.validators),
      convertToValidatorsArray(config.asyncValidators)
    );
    this.inputs = config.initialInputs;
    this.outputs = config.outputs;
    this.displayed = config.hasOwnProperty('displayed') ? config.displayed : true;
  }

  /**@inheritdoc */
  setValue(
    value: TValue,
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.setValue(value, options);
  }

  /**@inheritdoc */
  patchValue(
    value: TValue,
    options: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    } = {}
  ): void {
    super.patchValue(value, options);
  }

  /**@inheritdoc */
  reset(value?: TValue, options?: any): void {
    super.reset(value, options);
  }
}
