import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService, EvidenceFacadeService } from 'core/modules/data/services';
import {
  RiskCategoryFacadeService,
  RiskManagerEventService,
  RiskSourceFacadeService,
} from 'core/modules/risk/services/index';
import { of } from 'rxjs';
import { RiskFacadeService } from './risk-facade.service';

describe('RiskFacadeService', () => {
  let service: RiskFacadeService;
  let actionDispatcher: ActionDispatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        RiskFacadeService,
        {
          provide: ActionDispatcherService,
          useValue: {
            dispatchActionAsync: (): Promise<any> => {
              return of({}).toPromise();
            },
          },
        },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: RiskManagerEventService, useValue: {} },
        { provide: RiskCategoryFacadeService, useValue: {} },
        { provide: RiskSourceFacadeService, useValue: {} },
      ],
    });
    service = TestBed.inject(RiskFacadeService);
    actionDispatcher = TestBed.inject(ActionDispatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
