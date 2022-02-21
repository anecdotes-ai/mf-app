/* tslint:disable:no-unused-variable */

import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { SlackService } from './slack.service';

describe('Service: Slack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        SlackService,
      ],
    });
  });

  it('should ...', inject([SlackService], (service: SlackService) => {
    expect(service).toBeTruthy();
  }));
});
