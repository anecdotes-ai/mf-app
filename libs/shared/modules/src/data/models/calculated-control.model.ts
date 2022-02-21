import { CalculatedRequirement } from './calculated-requirement.model';
import { Control } from './domain';

export interface CalculatedControl extends Control {
  /**
   * Whether this control already has automatically collected evidence in it exclude manual evidence
   */
  control_has_automated_evidence_collected?: boolean;
  /**
  * Whether this control already has automatically collected evidence in it, both automated and manual
  */
  control_has_all_evidence_collected?: boolean;
  /**
   * Number of total already-collected requirements of this control
   */
  control_number_of_requirements_collected?: number;
  /**
   * Number of the total evidence collected including duplications
   */
  control_number_of_total_evidence_collected?: number;
  /**
   * * Number of applicable requirements
   */
  control_number_of_requirements?: number;
  /**
   * ids of all contol evidence that are applicable, belong to applicable requirement, not manual and collected
   */
  control_collected_automated_applicable_evidence_ids?: Array<string>;
  /**
   * ids of all contol evidence that are applicable, belong to applicable requirement, manual and automated and collected
   */
  control_collected_all_applicable_evidence_ids?: Array<string>;
  /**
   * The list of services display name that automates this control (automates each of the requirements this control has)
   */
  automating_services_display_name?: Array<string>;
  /**
   * The list of services ids name that automates this control (automates each of the requirements this control has)
   */
  automating_services_ids?: Array<string>;
  /**
   * The amount of missing requirements which needs to be collected
   */
  control_number_of_missing_evidence?: number;
  /**
   *  used in the search of controls
   */
  control_evidence_names?: string;

  control_requirements_names?: string;
  /**
   * Are there any marked for review evidence in this control
   */
  control_any_marked_evidence?: boolean;
  /**
   * Are there any new evidence in this control
   */
  control_any_new_evidence?: boolean;

  /**
   * Sorted calculated requirements including evidence
   */
  control_calculated_requirements?: CalculatedRequirement[];

  /**
   * Whether the control is gapped or not
   */
  control_is_gapped?: boolean;

  /**
   * the name of the framework to which this control belongs
   */
  control_framework?: string;
}



export function isControl(object: any): object is Control {
  return 'control_id' in object;
}
