import { ControlsService } from './controls.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ControlsService', () => {
  let service: ControlsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ControlsService],
    });
    service = TestBed.inject(ControlsService);
  });

  it('should be able to create service instance', () => {
    expect(service).toBeDefined();
  });
});
