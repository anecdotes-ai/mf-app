import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceInfoComponent } from './evidence-info.component';

describe('EvidenceInfoComponent', () => {
  let component: EvidenceInfoComponent;
  let fixture: ComponentFixture<EvidenceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidenceInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
