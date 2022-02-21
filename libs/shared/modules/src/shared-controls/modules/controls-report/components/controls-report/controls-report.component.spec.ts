import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService } from 'core';
import { CalculatedControl } from 'core/modules/data/models';
import { Customer } from 'core/modules/data/models/domain';
import { ControlsFacadeService, CustomerFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { reducers } from 'core/modules/data/store';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { ControlsReportComponent } from './controls-report.component';

describe('ControlsReportComponent', () => {
  configureTestSuite();
  let component: ControlsReportComponent;
  let loaderService: LoaderManagerService;
  let router: ActivatedRoute;
  let customerFacadeService: CustomerFacadeService;
  let fixture: ComponentFixture<ControlsReportComponent>;

  const mockCustomer: Observable<Customer> = of({ customer_name: 'randowm name', is_onboarded: true });
  const mockControls: CalculatedControl[] = [{ control_id: 'test_id1' }, { control_id: 'test_id2' }];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlsReportComponent],
      providers: [
        { provide: CustomerFacadeService, useValue: {} },
        {
          provide: ControlsFacadeService,
          useValue: {
            getAllControls: () => of(mockControls),
          },
        },
        {
          provide: FrameworksFacadeService,
          useValue: {
            getFramework: (framework_id: string) => of(mockControls),
          },
        },
        {
          provide: LoaderManagerService,
          useValue: { loaderStream$: of(true), show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { control_ids: JSON.stringify(mockControls) },
            },
          },
        }
      ],
      imports: [StoreModule.forRoot(reducers), TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsReportComponent);
    loaderService = TestBed.inject(LoaderManagerService);
    customerFacadeService = TestBed.inject(CustomerFacadeService);
    customerFacadeService.getCurrentCustomer = jasmine.createSpy('getCurrentCustomer').and.returnValue(mockCustomer);
    router = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should get customer data', async () => {
      // Assert
      expect(component.customer$).toBeFalsy();

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(customerFacadeService.getCurrentCustomer).toHaveBeenCalled();
      expect(component.customer$).toBe(mockCustomer);
    });
  });

  async function dispatchWindowEvent(eventName: string): Promise<void> {
    window.dispatchEvent(new Event(eventName));

    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('Printing document style apply', () => {
    it('should set on-printing css class to host element after beforeprint event', async () => {
      // Assert
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      dispatchWindowEvent('beforeprint');

      // Assert
      expect((fixture.nativeElement as HTMLElement).classList.contains('on-printing')).toBeTrue();
    });

    it('should reset on-printing css class on host element after afterprint event', async () => {
      // Arrange
      (fixture.nativeElement as HTMLElement).classList.add('on-printing');

      // Act
      dispatchWindowEvent('afterprint');

      // Assert
      expect((fixture.nativeElement as HTMLElement).classList.contains('on-printing')).toBeFalse();
    });
  });
});
