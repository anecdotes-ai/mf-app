import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export const SVG_SPRITE_PATH = new InjectionToken('SVG_SPRITE_PATH');

@Injectable()
export class SvgLoaderService {
  private httpClient: HttpClient;

  constructor(httpBackend: HttpBackend, @Inject(SVG_SPRITE_PATH) private svgSpritePath: string) {
    this.httpClient = new HttpClient(httpBackend);
  }

  getSprite(): Observable<string> {
    return this.httpClient.get(this.svgSpritePath, { responseType: 'text' });
  }
}
