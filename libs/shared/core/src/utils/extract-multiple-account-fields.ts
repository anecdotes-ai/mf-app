import { MultipleAccountsFieldsEnum, MultipleAccountsFields } from 'core/modules/plugins-connection/models';

export function extractMultipleAccountFields(values: { [key: string]: string }): MultipleAccountsFields {
  return {
    [MultipleAccountsFieldsEnum.AccountName]: values[MultipleAccountsFieldsEnum.AccountName],
  };
}
