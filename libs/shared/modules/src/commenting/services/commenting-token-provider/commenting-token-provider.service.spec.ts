import { inject, TestBed } from '@angular/core/testing';
import { AuthService } from 'core/modules/auth-core/services';
import { CommentingTokenProviderService } from './commenting-token-provider.service';

describe('Service: CommentingTokenProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentingTokenProviderService, { provide: AuthService, useValue: {} }],
    });
  });

  it('should ...', inject([CommentingTokenProviderService], (service: CommentingTokenProviderService) => {
    expect(service).toBeTruthy();
  }));
});
