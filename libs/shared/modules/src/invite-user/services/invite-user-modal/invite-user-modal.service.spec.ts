import { TestBed } from '@angular/core/testing';
import { ModalWindowService } from 'core/modules/modals';
import { InviteUserModalService } from './invite-user-modal.service';

describe('InviteUserModalService', () => {
  let service: InviteUserModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ModalWindowService, useValue: {} }, InviteUserModalService],
    });
    service = TestBed.inject(InviteUserModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
