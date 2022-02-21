import { reducers } from 'core/modules/data/store';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ActionDispatcherService, ControlsFacadeService, PoliciesFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { NoteFacadeService } from './note-facade.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('NoteFacadeService', () => {
  let service: NoteFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NoteFacadeService,
        { provide: ActionDispatcherService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
        provideMockStore(),
      ],
      imports: [StoreModule.forRoot(reducers)],
    });
    service = TestBed.inject(NoteFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
