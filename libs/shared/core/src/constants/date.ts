export const ApiDateFormat = 'yyyy-MM-dd HH:mm:ss.SSSS';
export const ApiTimeZone = 'UTC';
export const RegularDateFormat = 'MMM d, yyyy | HH:mm:ss';
export const RegularDateFormatMMMdyyyy = 'MMM d, yyyy';
export const Epoch = '1 January 1970, 00:00:00 UTC';
export const BEEpoch = '1970-01-01 00:00:00';
export const ShortDate = 'HH:mm MMM d, yyyy';

export function isEpoch(strDate: string): boolean {
    return Date.parse(strDate) === 0 || strDate === BEEpoch;
}
