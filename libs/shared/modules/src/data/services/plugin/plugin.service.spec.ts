/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PluginService } from './plugin.service';
import { HttpClientModule } from '@angular/common/http';
import { SvgRegistryService } from 'core/modules/svg-icons';

describe('Service: Plugin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PluginService, { provide: SvgRegistryService, useValue: {} }],
    });
  });

  it('should ...', inject([PluginService], (service: PluginService) => {
    expect(service).toBeTruthy();
  }));
});
