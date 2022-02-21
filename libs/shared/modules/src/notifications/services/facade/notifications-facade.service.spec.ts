import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService } from 'core/modules/data/services/action-dispatcher/action-dispatcher.service';
import { NotificationsFacadeService } from './notifications-facade.service';

describe('NotificationsFacadeService', () => {
  let service: NotificationsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), NotificationsFacadeService, { provide: ActionDispatcherService, useValue: {} }],
    });
    service = TestBed.inject(NotificationsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
