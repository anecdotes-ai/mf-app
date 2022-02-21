export interface Requirement {
  /**
   * The requirement unique ID
   */

  requirement_id?: string;
  /**
   * The requirement description
   */
  requirement_description?: string;
  /**
   * A short help phrase to describe this requirement
   */
  requirement_help?: string;
  /**
   * 	The requirement related controls
   */
  requirement_related_controls?: string[];
  /**
   * The requirement related frameworks, must include anecdotes-unified and at least 1 "real" framework
   */
  requirement_related_frameworks?: string[];
  /**
   * The requirement related evidence
   */
  requirement_related_evidences?: string[];

  /**
   * The requirement related evidence ids
   * NOTE: We dont' get this from the API. It gets fulfilled when breaking down control in ApiModelMapperService
   */
  requirement_evidence_ids?: string[];
}
