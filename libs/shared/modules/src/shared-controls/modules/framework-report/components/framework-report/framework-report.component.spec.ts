import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworkReportComponent } from './framework-report.component';
import { ActivatedRoute } from '@angular/router';
import { ControlsFacadeService, CustomerFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FrameworkReportComponent', () => {
  configureTestSuite();

  let component: FrameworkReportComponent;
  let fixture: ComponentFixture<FrameworkReportComponent>;

  let customerFacade: CustomerFacadeService;
  let frameworksFacade: FrameworksFacadeService;
  let controlsFacade: ControlsFacadeService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrameworkReportComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: 'framework_id' },
          },
        },
        { provide: CustomerFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkReportComponent);
    component = fixture.componentInstance;

    customerFacade = TestBed.inject(CustomerFacadeService);
    customerFacade.getCurrentCustomer = jasmine.createSpy('getCurrentCustomer').and.returnValue(of({}));

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getFrameworkById = jasmine.createSpy('getFrameworkById').and.returnValue(of({}));

    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getControlsByFrameworkId = jasmine.createSpy('getControlsByFrameworkId').and.returnValue(of([{}]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('child components should be truthy', () => {
    expect(fixture.debugElement.query(By.css('app-report-primary-header'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-report-secondary-header'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-report-controls-renderer'))).toBeTruthy();
  });
});
