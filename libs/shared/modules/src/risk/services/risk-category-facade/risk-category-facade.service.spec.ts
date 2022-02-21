import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { RiskCategoryFacadeService } from './risk-category-facade.service';

describe('RiskCategoryFacadeService', () => {
  let service: RiskCategoryFacadeService;
  let actionDispatcher: ActionDispatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        RiskCategoryFacadeService,
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
    service = TestBed.inject(RiskCategoryFacadeService);
    actionDispatcher = TestBed.inject(ActionDispatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
