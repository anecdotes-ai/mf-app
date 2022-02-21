import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RoleService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/modules/auth-core/models/domain/user';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { VisibleForRoleDirective } from './visible-for-role.directive';

@Component({
  template: `<div *visibleForRole="visibleForRole"><div id="protected-content"></div></div>`,
})
class TestComponent {
  @Input() visibleForRole: string | string[];
}

describe('VisibleForRoleDirective', () => {
  configureTestSuite();
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let roleService: RoleService;
  let returningRole: string;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [VisibleForRoleDirective, TestComponent],
      providers: [{ provide: RoleService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    roleService = TestBed.inject(RoleService);
    roleService.getCurrentUserRole = jasmine
      .createSpy('getCurrentUserRole')
      .and.callFake(() => of({ role: returningRole }));
  });

  describe('#ngOnInit', () => {
    it('should hide content if no current user role exists', async () => {
      // Arrange
      component.visibleForRole = [RoleEnum.Admin];
      returningRole = null;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content'))).toBeFalsy();
    });

    it('should show content if list of allowed roles includes current user role', async () => {
      // Arrange
      component.visibleForRole = [RoleEnum.Admin];
      returningRole = RoleEnum.Admin;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content'))).toBeTruthy();
    });

    it('should hide content if list of allowed roles does not include current user role', async () => {
      // Arrange
      returningRole = RoleEnum.User;
      component.visibleForRole = [RoleEnum.Admin];

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content'))).toBeFalsy();
    });

    it('should not hide content if list of allowed roles does is undefined', async () => {
      // Arrange
      component.visibleForRole = undefined;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content'))).toBeTruthy();
    });
  });
});
