import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { of } from 'rxjs';
import { UsersListComponent } from './users-list.component';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { VisibleForRoleDirective } from 'core/modules/directives';
import { UserFacadeService } from 'core/modules/auth-core/services';

describe('UsersListComponent', () => {
  configureTestSuite();

  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let roleService: RoleService;
  let authService: AuthService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [UsersListComponent, VisibleForRoleDirective],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUserAsync: jasmine.createSpy('getUserAsync').and.returnValue(of({ email: 'test_email' }).toPromise()),
          },
        },
        {
          provide: RoleService,
          useValue: {},
        },
        { provide: UserFacadeService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it(`should create expected translation key for this component`, async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const resultTranslationKey = component.buildTranslationKey('test');

      // Assert
      expect(resultTranslationKey).toEqual('userManagement.list.test');
    });
  });
});
