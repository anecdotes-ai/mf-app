import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLikeEvidenceGridComponent } from './table-like-evidence-grid.component';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

describe('TableLikeEvidenceGridComponent', () => {
  configureTestSuite();

  let component: TableLikeEvidenceGridComponent;
  let fixture: ComponentFixture<TableLikeEvidenceGridComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableLikeEvidenceGridComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLikeEvidenceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rowIsGapped()', () => {
    it('should return false if evidence_gap property is true', async () => {
      // Arrange
      component.evidenceDistinct$ = of({
        evidence_gap: null,
      });

      // Act
      fixture.detectChanges();

      // Assert
      expect(await component.rowIsGapped(1).toPromise()).toBeFalse();
    });

    it('should return false if rowId is not in evidence_gap array', async () => {
      // Arrange
      component.evidenceDistinct$ = of({
        evidence_gap: [1],
      });

      // Act
      fixture.detectChanges();

      // Assert
      expect(await component.rowIsGapped(2).toPromise()).toBeFalse();
    });

    it('should return true if rowId is in evidence_gap array', async () => {
      // Arrange
      component.evidenceDistinct$ = of({
        evidence_gap: [1],
      });

      // Act
      fixture.detectChanges();

      // Assert
      expect(await component.rowIsGapped(1).toPromise()).toBeTrue();
    });
  });
});
