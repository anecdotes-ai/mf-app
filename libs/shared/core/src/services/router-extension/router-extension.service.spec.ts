import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { RouterExtensionService } from './router-extension.service';

describe('RouterExtensionService', () => {
  let service: RouterExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(RouterExtensionService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
