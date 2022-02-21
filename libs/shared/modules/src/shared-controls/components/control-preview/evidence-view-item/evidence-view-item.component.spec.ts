import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceViewItemComponent } from './evidence-view-item.component';
import { EvidenceFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

describe('EvidenceViewItemComponent', () => {
  configureTestSuite();

  let component: EvidenceViewItemComponent;
  let fixture: ComponentFixture<EvidenceViewItemComponent>;

  let evidenceFacade: EvidenceFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvidenceViewItemComponent],
      providers: [{ provide: EvidenceFacadeService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceViewItemComponent);
    component = fixture.componentInstance;

    evidenceFacade = TestBed.inject(EvidenceFacadeService);
    evidenceFacade.getEvidenceLike = jasmine.createSpy('getEvidenceLike').and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
