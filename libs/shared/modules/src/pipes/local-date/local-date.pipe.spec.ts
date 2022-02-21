import { DatePipe } from '@angular/common';
import { LocalDatePipe } from './local-date.pipe';

describe('LocalDatePipe', () => {
  let localDatePipe: LocalDatePipe;
  let angularDatePipe: DatePipe;

  const testFormat = 'MMM dd, yyyy HH:mm:ss';
  const testTimezone = 'UTC';
  const testLocale = 'en-US';

  beforeEach(() => {
    localDatePipe = new LocalDatePipe(testLocale);
    angularDatePipe = new DatePipe(testLocale);
  });

  describe('when called with string without zero identifier', () => {
    it('should append zero identifier in the end of the string and return correct date string representation according to UTC date', () => {
      // Arrange
      const dateString = '2021-01-05T13:49:49.370';

      // Act
      const actual = localDatePipe.transform(dateString, testFormat, testTimezone);

      // Assert
      expect(actual).toBe(angularDatePipe.transform(`${dateString}z`, testFormat, testTimezone));
    });

    it('should not append zero identifier in the end of the string if input value already has "z" in lowercase', () => {
      // Arrange
      const dateString = '2021-01-05T13:49:49.370z';

      // Act
      const actual = localDatePipe.transform(dateString, testFormat, testTimezone);

      // Assert
      expect(actual).toBe(angularDatePipe.transform(dateString, testFormat, testTimezone));
    });

    it('should not append zero identifier in the end of the string if input value already has "z" in uppercase', () => {
      // Arrange
      const dateString = '2021-01-05T13:49:49.370Z';

      // Act
      const actual = localDatePipe.transform(dateString, testFormat, testTimezone);

      // Assert
      expect(actual).toBe(angularDatePipe.transform(dateString, testFormat, testTimezone));
    });
  });
});
