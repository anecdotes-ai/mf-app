import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidencePreviewItemComponent } from './evidence-preview-item.component';

describe('EvidencePreviewItemComponent', () => {
  let component: EvidencePreviewItemComponent;
  let fixture: ComponentFixture<EvidencePreviewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidencePreviewItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePreviewItemComponent);
    component = fixture.componentInstance;
    component.evidence = {
      evidence_gap: null
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
