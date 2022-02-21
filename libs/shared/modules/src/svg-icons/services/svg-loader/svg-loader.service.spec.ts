import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SvgLoaderService, SVG_SPRITE_PATH } from './svg-loader.service';

describe('SvgLoaderService', () => {
  let service: SvgLoaderService;

  const fakeSpritePath = '/fake/sprite/path/icons.svg';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SvgLoaderService, { provide: SVG_SPRITE_PATH, useValue: fakeSpritePath }],
    });
    service = TestBed.inject(SvgLoaderService);
  });

  it('should be able to create service instance', () => {
    expect(service).toBeDefined();
  });
});
