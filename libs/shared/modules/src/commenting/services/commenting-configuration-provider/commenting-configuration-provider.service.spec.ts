import { TestBed, inject } from '@angular/core/testing';
import { CommentingConfigurationProviderService } from './commenting-configuration-provider.service';
import { AuthService } from 'core/modules/auth-core/services';
import { provideMockStore } from '@ngrx/store/testing';

describe('Service: CommentingConfigurationProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentingConfigurationProviderService, provideMockStore(), { provide: AuthService, useValue: {} }],
    });
  });

  it('should ...', inject(
    [CommentingConfigurationProviderService],
    (service: CommentingConfigurationProviderService) => {
      expect(service).toBeTruthy();
    }
  ));
});
