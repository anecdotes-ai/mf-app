/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewEvidenceComponent } from './view-evidence.component';
import { FileDownloadingHelperService } from 'core';
import { EvidenceService } from 'core/modules/data/services';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';

describe('ViewEvidenceComponent', () => {
  configureTestSuite();

  let component: ViewEvidenceComponent;
  let fixture: ComponentFixture<ViewEvidenceComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ViewEvidenceComponent],
      providers: [
        { provide: EvidenceService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEvidenceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
