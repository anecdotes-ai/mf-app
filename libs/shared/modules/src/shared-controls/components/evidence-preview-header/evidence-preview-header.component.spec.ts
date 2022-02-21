import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidencePreviewHeaderComponent } from './evidence-preview-header.component';

describe('EvidencePreviewHeaderComponent', () => {
  let component: EvidencePreviewHeaderComponent;
  let fixture: ComponentFixture<EvidencePreviewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidencePreviewHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidencePreviewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
