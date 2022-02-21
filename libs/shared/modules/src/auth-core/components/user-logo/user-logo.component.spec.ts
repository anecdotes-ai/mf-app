/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLogoComponent } from './user-logo.component';
import { AuthService, UserFacadeService } from 'core/modules/auth-core/services';
import { ActionDispatcherService } from 'core/modules/data/services/action-dispatcher/action-dispatcher.service';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';


describe('UserLogoComponent', () => {
  let component: UserLogoComponent;
  let fixture: ComponentFixture<UserLogoComponent>;
  let userFacadeService: UserFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserLogoComponent],
      providers: [provideMockStore(),
      { provide: ActionDispatcherService, useValue: {} },
      { provide: AuthService, useValue: {} }, UserFacadeService]
    }).compileComponents();
  });

  beforeEach(() => {
    userFacadeService = TestBed.inject(UserFacadeService);
    spyOn(userFacadeService, 'getUsers').and.returnValue(of([]));
    fixture = TestBed.createComponent(UserLogoComponent);
    component = fixture.componentInstance;
    component.userId = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
