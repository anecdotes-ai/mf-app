import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { WindowHelperService } from './window-helper.service';

describe('WindowHelperService', () => {
  let service: WindowHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: Router, useValue: {} }],
    });
    service = TestBed.inject(WindowHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
