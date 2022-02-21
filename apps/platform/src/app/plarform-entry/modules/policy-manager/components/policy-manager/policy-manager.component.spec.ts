import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizationModalService } from 'core/modules/customization/services';
import { LoaderManagerService } from 'core';

import { PolicyManagerComponent } from './policy-manager.component';
import { PoliciesFacadeService } from 'core/modules/data/services';
import { Observable, of } from 'rxjs';

describe('PolicyManagerComponent', () => {
  let component: PolicyManagerComponent;
  let fixture: ComponentFixture<PolicyManagerComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyManagerComponent],
      providers: [
        { provide: LoaderManagerService, useValue: { hide(): void {}, show(): void {} } },
        { provide: CustomizationModalService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: { getAllNotApplicablePolicies(): Observable<any[]> { return of([]); }} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
