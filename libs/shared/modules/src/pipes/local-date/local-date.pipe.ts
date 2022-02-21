import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  pure: true,
})
export class LocalDatePipe extends DatePipe implements PipeTransform {
  // This pipe fixes dates sent by the API that are UTC dates but without zero-identifier (z in the end of the date string)
  // Should be used for all dates coming from the API
  private static zeroSufix = 'z';

  transform(value: any, format?: string, timezone?: string, locale?: string): any {
    let modifiedValue = value;

    if (typeof modifiedValue === 'string' && !modifiedValue.toLowerCase().endsWith(LocalDatePipe.zeroSufix)) {
      modifiedValue = `${modifiedValue}${LocalDatePipe.zeroSufix}`;
    }

    return super.transform(modifiedValue, format, timezone, locale);
  }
}
