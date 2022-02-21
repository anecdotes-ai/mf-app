import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { RiskSourceFacadeService } from './risk-source-facade.service';

describe('RiskSourceFacadeService', () => {
  let service: RiskSourceFacadeService;
  let actionDispatcher: ActionDispatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        RiskSourceFacadeService,
        {
          provide: ActionDispatcherService,
          useValue: {
            dispatchActionAsync: (): Promise<any> => {
              return of({}).toPromise();
            },
          },
        },
      ],
    });
    service = TestBed.inject(RiskSourceFacadeService);
    actionDispatcher = TestBed.inject(ActionDispatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
