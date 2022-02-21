import { strictUrl } from './url/strict-url.validator';
import { url } from './url/url.validator';
import { matchingValidator } from './matching/matching.validator';
import { weakPasswordValidator } from './weak-password/weak-password.validator';
import { emailCustomValidator } from './email/email.validator';
import { noWhiteSpace } from './no-whitespace/no-whitespace.validator';
import { dateRangeValidator } from './date/date.validator';
import { exactMatchValidator } from './exact-match/exact-match.validator';
import { jsonValidator } from './file/json.validator';

export const CustomValidators = {
  strictUrl,
  url,
  noWhiteSpace,
  matchingValidator,
  weakPasswordValidator,
  emailCustomValidator,
  dateRangeValidator,
  exactMatchValidator,
  jsonValidator
};
