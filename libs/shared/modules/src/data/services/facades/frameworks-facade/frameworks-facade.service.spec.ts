import { UserFacadeService } from './../../../../auth-core/services/facades/user-facade/user-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ControlsFacadeService } from 'core/modules/data/services';
import { FrameworksFacadeService } from './frameworks-facade.service';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ActionDispatcherService } from '../../../services';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { FrameworksEventService } from 'core/modules/data/services';

describe('FrameworksFacadeService', () => {
  let service: FrameworksFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), FrameworksFacadeService,
        { provide: ControlsFacadeService, useValue: {} },
        { provide: UserFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: FrameworksEventService, useValue: {} },
        {
          provide: ActionDispatcherService,
          useValue: {
            dispatchActionAsync: (action: Action, operationId: string, operationPartition?: string): Promise<any> => {
              return of({}).toPromise();
            },
          },
        },
      ],
    });
    service = TestBed.inject(FrameworksFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
