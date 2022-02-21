import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ControlsFacadeService, CustomerFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { State } from 'core/modules/data/store';
import { CustomerState } from 'core/modules/data/store/reducers';
import { LoaderManagerService, MessageBusService, WindowHelperService } from 'core/services';
import { configureTestSuite } from 'ng-bullet';
import { ModalWindowService } from 'core/modules/modals';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ControlsPageComponent } from './controls-page.component';

describe('ControlsPageComponent', () => {
  configureTestSuite();

  let component: ControlsPageComponent;
  let fixture: ComponentFixture<ControlsPageComponent>;
  let mockStore: MockStore<State>;
  let mockCustomerState: CustomerState;
  let windowHelperService: WindowHelperService;
  let modalWindowService: ModalWindowService;

  let controlsFacade: ControlsFacadeService;
  let customerFacadeService: CustomerFacadeService;
  let customerIsOnboarded = false;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ControlsPageComponent],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        {
          provide: WindowHelperService,
          useValue: {
            openUrlInNewTab: jasmine.createSpy('openUrlInNewTab'),
            getWindow: jasmine.createSpy('getWindow').and.returnValue({
              localStorage: { setItem: () => {} },
            }),
          },
        },
        { provide: CustomerFacadeService, useValue: {} },
        provideMockStore(),
        { provide: ControlsFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        LoaderManagerService,
        MessageBusService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsPageComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(MockStore);
    mockCustomerState = { customer: undefined, initialized: false };
    mockStore.dispatch = jasmine.createSpy('dispatch');

    windowHelperService = TestBed.inject(WindowHelperService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.open = jasmine.createSpy('open');

    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getAreControlsLoaded = jasmine.createSpy('getAreControlsLoaded').and.returnValue(of(true));
    controlsFacade.getAllControls = jasmine.createSpy('getAllControls').and.returnValue(
      of([
        { control_id: '123', control_name: '123', control_category: 'category_1' },
        { control_id: '456', control_name: '456', control_category: 'category_1' },
        { control_id: '789', control_name: '789', control_category: 'category_2' },
      ])
    );

    customerFacadeService = TestBed.inject(CustomerFacadeService);
    customerFacadeService.getCurrentCustomerIsOnboarded = jasmine
      .createSpy('getCurrentCustomerIsOnboarded')
      .and.callFake(() => of(customerIsOnboarded));
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should correctly set customerIsOnboarded from customer facade', async () => {
      // Arrange
      customerIsOnboarded = true;

      // Act
      await detectChanges();

      // Assert
      const res = await component.customerIsOnboarded$.pipe(take(1)).toPromise();
      expect(res).toBeTrue();
    });
  });


  describe('#controlsLoaded', () => {
    it('should open modal once customer started with anecdotes essentials', async () => {
      // Arrange
      customerIsOnboarded = false;

      // Act
      await detectChanges();
      component.controlsLoaded();

      // Arrange
      expect(modalWindowService.open).toHaveBeenCalled();
    });
  });


  describe('#buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', async () => {
      // Arrange
      const relativeKey = 'someRelativeKey';
      customerIsOnboarded = false;

      // Act
      await detectChanges();
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`controls.${relativeKey}`);
    });
  });
});
