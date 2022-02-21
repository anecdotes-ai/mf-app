import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportSecondaryHeaderComponent } from './report-secondary-header.component';
import { configureTestSuite } from 'ng-bullet';

describe('ReportSecondaryHeaderComponent', () => {
  configureTestSuite();

  let component: ReportSecondaryHeaderComponent;
  let fixture: ComponentFixture<ReportSecondaryHeaderComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportSecondaryHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSecondaryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return appropriate translation key', () => {
    // Arrange
    const key = 'key';
    const parentKey = 'frameworkReport.secondaryHeader';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${parentKey}.${key}`);
  });

  it('should return appropriate icon path', () => {
    // Arrange
    const frameworkId = 'id';
    const parentKey = 'frameworks/';

    // Act
    const result = component.buildIconPath(frameworkId);

    // Assert
    expect(result).toEqual(`${parentKey}${frameworkId}`);
  });
});
