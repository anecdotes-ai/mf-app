import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidencesListComponent } from './evidences-list.component';
import { MessageBusService } from 'core';
import { DataAggregationFacadeService, RequirementsFacadeService } from 'core/modules/data/services/facades';
import { Directive } from '@angular/core';

@Directive({
  selector: '[collectingEvidenceHost]',
  exportAs: 'collectingEvidenceHost',
})
export class CollectingEvidenceHostDirectiveMock {}

describe('EvidencesListComponent', () => {
  let component: EvidencesListComponent;
  let fixture: ComponentFixture<EvidencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageBusService,
        { provide: DataAggregationFacadeService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
      ],
      declarations: [EvidencesListComponent, CollectingEvidenceHostDirectiveMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
