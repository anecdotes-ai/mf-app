import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMultipleAccountsConnectionModalComponent } from './confirm-multiple-accounts-connection-modal.component';

describe('ConfirmMultipleAccountsConnectionModalComponent', () => {
  let component: ConfirmMultipleAccountsConnectionModalComponent;
  let fixture: ComponentFixture<ConfirmMultipleAccountsConnectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmMultipleAccountsConnectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMultipleAccountsConnectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
