/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SnapshotMenuComponent } from './snapshot-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { EvidenceService } from 'core/modules/data/services';
import { LocalDatePipe } from 'core/modules/pipes';

describe('SnapshotMenuComponent', () => {
  let component: SnapshotMenuComponent;
  let fixture: ComponentFixture<SnapshotMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnapshotMenuComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: EvidenceService, useValue: {} },
        { provide: LocalDatePipe, useValue: {} }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotMenuComponent);
    component = fixture.componentInstance;
  });
});
