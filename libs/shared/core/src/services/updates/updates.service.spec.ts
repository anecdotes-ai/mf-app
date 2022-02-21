import { TestBed } from '@angular/core/testing';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { LoggerService } from 'core';
import { UpdatesService } from './updates.service';

describe('UpdatesService', () => {
  let service: UpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwUpdate, LoggerService],
      imports: [ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })],
    });
    service = TestBed.inject(UpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
