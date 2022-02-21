import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  CustomerFacadeService,
  FrameworksFacadeService,
  PluginFacadeService,
  TrackOperations
} from 'core/modules/data/services';
import { InviteUserModalService } from 'core/modules/invite-user';
import { of } from 'rxjs';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { Framework, Service } from 'core/modules/data/models/domain';
import { OperationsTrackerService } from 'core/modules/data/services/operations-tracker/operations-tracker.service';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingSharedContext } from './../../models/onboarding-shared-context.model';
import { OnboardingCompanyComponent } from './onboarding-company.component';
import { OnboardingUserEventService } from '../../services/onboarding-user-event.service';

describe('OnboardingCompanyComponent', () => {
  let component: OnboardingCompanyComponent;
  let fixture: ComponentFixture<OnboardingCompanyComponent>;
  let switcher: ComponentSwitcherDirective;
  let inviteUserService: InviteUserModalService;
  let frameworkFacadeService: FrameworksFacadeService;
  let pluginFacadeService: PluginFacadeService;
  let operationtrackerService: OperationsTrackerService;
  let customerFacade: CustomerFacadeService;
  let onboardingEventService: OnboardingUserEventService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  const selectedFramework: Framework[] = [
    {
      framework_name: 'name1',
      framework_id: 'id1',
      is_applicable: false,
    },
    {
      framework_name: 'name2',
      framework_id: 'id2',
      is_applicable: true,
    },
  ];

  const selectedPlugins: Service[] = [
    {
      service_display_name: 'name1',
      service_id: 'id1',
    },
    {
      service_display_name: 'name2',
      service_id: 'id2',
    },
  ];

  const sharedContext: OnboardingSharedContext = {
    selectedFramework: selectedFramework,
    selectedPlugins: selectedPlugins,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingCompanyComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: InviteUserModalService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: PluginFacadeService, useValue: {} },
        { provide: OperationsTrackerService, useValue: {} },
        { provide: CustomerFacadeService, useValue: {} },
        { provide: OnboardingUserEventService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingCompanyComponent);
    component = fixture.componentInstance;
    switcher = TestBed.inject(ComponentSwitcherDirective);
    frameworkFacadeService = TestBed.inject(FrameworksFacadeService);
    pluginFacadeService = TestBed.inject(PluginFacadeService);
    operationtrackerService = TestBed.inject(OperationsTrackerService);
    customerFacade = TestBed.inject(CustomerFacadeService);
    inviteUserService = TestBed.inject(InviteUserModalService);
    inviteUserService.openInviteUserModal = jasmine.createSpy('openInviteUserModal');
    operationtrackerService.getOperationStatus = jasmine.createSpy('getOperationStatus').and.returnValue(of('smth'));
    frameworkFacadeService.adoptFrameworkAsync = jasmine.createSpy('adoptFrameworkAsync');
    pluginFacadeService.addPluginToFavorites = jasmine.createSpy('addPluginToFavorites');
    customerFacade.markCustomerAsOnboarded = jasmine.createSpy('markCustomerAsOnboarded');
    switcher.goById = jasmine.createSpy('goById');
    switcher.sharedContext$ = of(sharedContext);

    onboardingEventService = TestBed.inject(OnboardingUserEventService);
    onboardingEventService.trackFlowEndedEvent = jasmine.createSpy('trackFlowEndedEvent');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInitMethod', () => {
    it('should call getOperationStatus and have subs to setting userInvited to true', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(operationtrackerService.getOperationStatus).toHaveBeenCalledWith('user', TrackOperations.CREATE_USER);
      expect(component.userInvited).toEqual(true);
    });
  });

  describe('buildTranslationKey method', () => {
    it('should build correct translation key', () => {
      // Arrange
      const relativeKey = 'fake-relative-key';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`onboardingWizard.company.${relativeKey}`);
    });
  });

  describe('onBackClick method', () => {
    it('should navigate to policy page', () => {
      // Act
      component.onBackClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.PolicyManaging);
    });
  });

  describe('onDoneClick method', () => {
    it('should navigate to policy page', async () => {
      // Arrange
      await detectChanges();

      // Act
      await component.onDoneClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(OnboardingComponentIds.Done);
    });

    it('should call changeFrameworkApplicability for only not_applicable frameworks', async () => {
      // Arrange
      await detectChanges();

      // Act
      await component.onDoneClick();

      // Assert
      expect(frameworkFacadeService.adoptFrameworkAsync).toHaveBeenCalledWith(selectedFramework[0]);
    });

    it('should call setCurrentUserAsKnown', async () => {
      // Arrange
      await detectChanges();

      // Act
      await component.onDoneClick();

      // Assert
      expect(customerFacade.markCustomerAsOnboarded).toHaveBeenCalled();
    });

    it('should call addPluginToFavorites for every plugin', async () => {
      // Arrange
      await detectChanges();

      // Act
      await component.onDoneClick();

      // Assert
      expect(pluginFacadeService.addPluginToFavorites).toHaveBeenCalledTimes(2);
    });

    it('should call trackFlowEndedEvent method', async () => {
      // Arrange
      await detectChanges();

      // Act
      await component.onDoneClick();

      // Assert
      expect(onboardingEventService.trackFlowEndedEvent).toHaveBeenCalledWith();
    });
  });

  describe('inviteUserClick()', () => {
    it('should navigate to policy page', () => {
      // Act
      component.inviteUserClick();

      // Assert
      expect(inviteUserService.openInviteUserModal).toHaveBeenCalled();
    });
  });
});
