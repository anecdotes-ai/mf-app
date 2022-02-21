import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportControlComponent } from './report-control.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';

describe('ReportControlComponent', () => {
  configureTestSuite();
  let component: ReportControlComponent;
  let fixture: ComponentFixture<ReportControlComponent>;

  const control = {
    control_id: 'id',
  };

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportControlComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mat-expansion-panel should be displayed', () => {
    // Arrange
    component.control = control;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.query(By.css('mat-expansion-panel'))).toBeTruthy();
  });

  it('rowTrackBy should return control id', () => {
    // Arrange
    // Act
    const result = component.rowTrackBy(control);

    // Assert
    expect(result).toEqual('id');
  });

  it('should return appropriate translation key', () => {
    // Arrange
    const key = 'key';
    const parentKey = 'frameworkReport.reportControl.';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${parentKey}${key}`);
  });
});
