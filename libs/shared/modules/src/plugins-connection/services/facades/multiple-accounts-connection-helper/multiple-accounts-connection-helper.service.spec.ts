import { ModalWindowService } from './../../../../modals/services/modal-window/modal-window.service';
import { PluginConnectionFacadeService } from './../plugin-connection-facade/plugin-connection-facade.service';
import { TestBed } from '@angular/core/testing';

import { MultipleAccountsConnectionHelperService } from './multiple-accounts-connection-helper.service';

describe('MultipleAccountsConnectionHelperService', () => {
  let service: MultipleAccountsConnectionHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PluginConnectionFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} }
      ]
    });
    service = TestBed.inject(MultipleAccountsConnectionHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
