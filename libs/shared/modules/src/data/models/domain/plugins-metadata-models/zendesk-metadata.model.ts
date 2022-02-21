export interface ZendeskMetadata {
  groups: Array<ZendeskGroupMetadata>;
  ticket_fields: Array<ZendeskTicketFieldMetadata>;
}

export interface ZendeskGroupMetadata {
  /**
   * The time the group was created
   */
  created_at?: string;
  /**
   * If group is default for the account
   */
  default?: boolean;
  /**
   * Deleted groups get marked as such
   */
  deleted?: boolean;
  /**
   * The description of the group
   */
  description?: string;
  /**
   * Automatically assigned when creating groups
   */
  id?: number;
  /**
   * The name of the group
   */
  name: string;
  /**
   * The time of the last update of the group
   */
  updated_at?: string;
  /**
   * The API url of this group
   */
  url: string;
}

export interface ZendeskTicketFieldMetadata {
  /**
   * Whether this field is available
   */
  active?: boolean;
  /**
   *  A description of the ticket field that only agents can see
   */
  agent_description?: string;
  /**
   *      If true, the field is shown to agents by default. If false, the field is hidden longside   infrequently used fields. Classic interface only
   */
  collapsed_for_agents?: boolean;
  /**
   *      The time the custom ticket field was created
   */
  created_at?: string;
  /**
   *      Required and presented for a custom ticket field of type "multiselect" or "tagger"
   */
  custom_field_options?: Array<ZendeskCustomFieldOption>;
  /**
   *      Describes the purpose of the ticket field to users
   */
  description?: string;
  /**
   *         Whether this field is editable by end users in Help Center
   */

  editable_in_portal?: boolean;
  /**
   *   Automatically assigned when created
   */
  id?: number;
  /**
   *    The relative position of the ticket field on a ticket. Note that for accounts with ticket forms, positions are controlled by the different forms
   */
  position?: number;
  /**
   *    The dynamic content placeholder if present, or the description value if not. See Dynamic Content
   */
  raw_description?: string;
  /**
   *   The dynamic content placeholder if present, or the title value if not. See Dynamic Content
   */
  raw_title?: string;
  /**
   *   The dynamic content placeholder if present, or the "title_in_portal" value if not. See Dynamic Content
   */
  raw_title_in_portal?: string;
  /**
   *    For "regexp" fields only. The validation pattern for a field value to be deemed valid
   */
  regexp_for_validation?: string;
  /**
   *    If false, this field is a system field that must be present on all tickets
   */
  removable?: boolean;
  /**
   *    If true, agents must enter a value in the field to change the ticket status to solved
   */
  required?: boolean;
  /**
   *    If true, end users must enter a value in the field to create the request
   */
  required_in_portal?: boolean;
  /**
   *   For system ticket fields of type "priority" and "status". Defaults to 0. A "priority" sub type of 1 removes the "Low" and "Urgent" options. A "status" sub type of 1 adds the "On-Hold" option
   */
  sub_type_id?: number;
  /**
   *    Presented for a system ticket field of type "tickettype", "priority" or "status"
   */
  system_field_options?: Array<ZendeskSystemFieldOption>;
  /**
   *   For "checkbox" fields only. A tag added to tickets when the checkbox field is selected
   */
  tag?: string;
  /**
   *   The title of the ticket field
   */
  title: string;
  /**
   *   The title of the ticket field for end users in Help Center
   */
  title_in_portal?: string;
  /**
   *    System or custom field type. Editable for custom field types and only on creation. See Create Ticket Field
   */
  type: string;
  /**
   *    The time the custom ticket field was last updated
   */
  updated_at?: string;
  /**
   *    The URL for this resource
   */
  url?: string;
  /**
   *    Whether this field is visible to end users in Help Center
   */
  visible_in_portal?: boolean;
}

export interface ZendeskCustomFieldOption extends ZendeskSystemFieldOption {
  default?: boolean;
  id: number;
  position?: any;
  raw_name?: string;
  url?: string;
}

export interface ZendeskSystemFieldOption {
  name: string;
  value: string;
}
