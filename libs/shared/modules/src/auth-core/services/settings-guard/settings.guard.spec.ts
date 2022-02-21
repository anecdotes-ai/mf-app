import { async, TestBed } from '@angular/core/testing';
import { SettingsGuard } from './settings.guard';
import { RoleService } from 'core/modules/auth-core/services';
import { Router } from '@angular/router';

describe('SettingsGuard', () => {
  let guard: SettingsGuard;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [SettingsGuard, { provide: RoleService, useValue: {} }, { provide: Router, useValue: {} }],
    });
    guard = TestBed.inject(SettingsGuard);
  }));

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
