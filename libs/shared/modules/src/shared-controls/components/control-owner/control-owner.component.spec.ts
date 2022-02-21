import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { SharedContextAccessorDirective } from '../../directives';
import { ControlOwnerComponent } from './control-owner.component';
import { ControlsFacadeService } from 'core/modules/data/services';
import { UserFacadeService } from 'core/modules/auth-core/services';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';
import { CalculatedControl } from 'core/modules/data/models';
import { User } from 'core/modules/auth-core/models/domain';
import { InviteUserModalService } from 'core/modules/invite-user';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';
import { OperationsTrackerService } from 'core/modules/data/services';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { Framework } from 'core/modules/data/models/domain';

describe('ControlOwnerComponent', () => {
  configureTestSuite();

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  let component: ControlOwnerComponent;
  let fixture: ComponentFixture<ControlOwnerComponent>;

  let controlsFacadeServiceMock: ControlsFacadeService;
  let userFacadeMock: UserFacadeService;
  let generalEventService: GeneralEventService;
  let inviteUserModalService: InviteUserModalService;
  let operationsTrackerService: OperationsTrackerService;
  let messageBusService: MessageBusService;

  let adminUser: User;
  let itUser: User;
  let user: User;
  let auditor: User;

  let users: User[];
  let sortedAndFilteredUsers: User[];

  let controlInstance: CalculatedControl = {
    control_id: 'some-control-id',
  };

  const frameworkId = 'some-framework-id';

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: ControlsFacadeService, useValue: {} },
          { provide: MessageBusService, useValue: {} },
          { provide: UserFacadeService, useValue: {} },
          { provide: GeneralEventService, useValue: {} },
          { provide: InviteUserModalService, useValue: {} },
          { provide: OperationsTrackerService, useValue: {} },
        ],
        imports: [RouterTestingModule, TranslateModule.forRoot(), MatExpansionModule, BrowserAnimationsModule],
        declarations: [ControlOwnerComponent, SharedContextAccessorDirective],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlOwnerComponent);
    component = fixture.componentInstance;

    adminUser = {
      first_name: 'first-name',
      last_name: 'last-name',
      email: 'some-email',
      uid: 'some-owner-id',
      role: 'admin',
      audit_frameworks: [],
    } as User;

    itUser = {
      first_name: 'first-name2',
      last_name: 'last-name2',
      email: 'some-email2',
      uid: 'some-owner-id2',
      role: 'it',
      audit_frameworks: [],
    } as User;

    user = {
      first_name: 'first-name3',
      last_name: 'last-name3',
      email: 'some-email3',
      uid: 'some-owner-id3',
      role: 'user',
      audit_frameworks: [],
    } as User;

    auditor = {
      first_name: 'auditor-name',
      last_name: 'auditor-last',
      email: 'auditor-email',
      uid: 'auditor-id',
      role: 'user',
      audit_frameworks: [frameworkId],
    } as User;

    users = [adminUser, itUser, user];
    sortedAndFilteredUsers = [adminUser, user];

    generalEventService = TestBed.inject(GeneralEventService);
    generalEventService.trackSelectControlOwnerEvent = jasmine.createSpy('trackSelectControlOwnerEvent');

    userFacadeMock = TestBed.inject(UserFacadeService);
    userFacadeMock.getUsers = jasmine.createSpy('getUsers').and.callFake(() => of(users));

    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeServiceMock.updateControlOwner = jasmine.createSpy('updateControlOwner');

    inviteUserModalService = TestBed.inject(InviteUserModalService);
    inviteUserModalService.openInviteUserModal = jasmine.createSpy('openInviteUserModal');

    operationsTrackerService = TestBed.inject(OperationsTrackerService);
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    component.framework = {
      framework_name: 'some-name',
      framework_id: frameworkId,
    } as Framework;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
