import { ActionDispatcherService } from './../../action-dispatcher/action-dispatcher.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AgentsFacadeService } from './agents-facade.service';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';

describe('AgentsFacadeService', () => {
  let service: AgentsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), 
        {
          provide: ActionDispatcherService,
          useValue: {
            dispatchActionAsync: (action: Action, operationId: string, operationPartition?: string): Promise<any> => {
              return of({}).toPromise();
            },
          },
        },
      ]
    });
    service = TestBed.inject(AgentsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
