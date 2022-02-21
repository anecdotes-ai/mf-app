import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportPrimaryHeaderComponent } from './report-primary-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';

describe('ReportPrimaryHeaderComponent', () => {
  configureTestSuite();

  let component: ReportPrimaryHeaderComponent;
  let fixture: ComponentFixture<ReportPrimaryHeaderComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportPrimaryHeaderComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPrimaryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return appropriate translation key', () => {
    // Arrange
    const key = 'key';
    const parentKey = 'frameworkReport.primaryHeader';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${parentKey}.${key}`);
  });

  it('should return company name if it exists', () => {
    // Arrange
    component.customer = {
      customer_name: 'name'
    };

    // Act
    const result = component.resolveCompanyName();

    // Assert
    expect(result).toEqual('name');
  });

  it('should return "..." if company name doesnt exist', () => {
    // Arrange
    component.customer = {
      customer_name: undefined
    };

    // Act
    const result = component.resolveCompanyName();

    // Assert
    expect(result).toEqual('...');
  });
});
