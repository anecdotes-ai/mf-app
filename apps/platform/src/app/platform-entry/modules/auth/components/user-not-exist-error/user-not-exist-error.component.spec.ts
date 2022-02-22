/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserNotExistErrorComponent } from './user-not-exist-error.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UserNotExistErrorComponent', () => {
  let component: UserNotExistErrorComponent;
  let fixture: ComponentFixture<UserNotExistErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotExistErrorComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotExistErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
