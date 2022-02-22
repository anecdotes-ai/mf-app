import { TranslateService } from '@ngx-translate/core';
import { ComponentFactoryResolver, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveReportSlideComponent } from './executive-report-slide.component';
import { of } from 'rxjs';

export class MockElementRef extends ElementRef {}

export class MockTranslateService {
  public get(key: any): any {
    of(key);
  }
}

describe('ExecutiveReportSlideComponent', () => {
  let component: ExecutiveReportSlideComponent;
  let fixture: ComponentFixture<ExecutiveReportSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutiveReportSlideComponent],
      providers: [
        ComponentFactoryResolver,
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: ElementRef, useClass: MockElementRef },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveReportSlideComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
