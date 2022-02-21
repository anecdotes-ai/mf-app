import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoggerService {
  log(log: any): void {
    if (!environment.production) {
      /* eslint-disable no-console */
      console.log(log);
    }
  }

  error(err: Error): void {
    if (!environment.production) {
      /* eslint-disable no-console */
      console.error(err);
    }
  }
}
