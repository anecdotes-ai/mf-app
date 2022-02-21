import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementViewItemComponent } from './requirement-view-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatedRequirement } from 'core/modules/data/models';
import { configureTestSuite } from 'ng-bullet';

describe('RequirementViewItemComponent', () => {
  configureTestSuite();

  let component: RequirementViewItemComponent;
  let fixture: ComponentFixture<RequirementViewItemComponent>;

  const req: CalculatedRequirement = {
    requirement_evidence_ids: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequirementViewItemComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementViewItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
