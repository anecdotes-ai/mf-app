import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { reducers } from 'core/modules/data/store';

import { SlackModalService } from './slack-modal.service';

describe('SlackModalService', () => {
  let service: SlackModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
      imports: [StoreModule.forRoot(reducers)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SlackModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
