/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificInformationItemComponent } from './specific-information-item.component';

describe('SpecificInformationItemComponent', () => {
  let component: SpecificInformationItemComponent;
  let fixture: ComponentFixture<SpecificInformationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificInformationItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificInformationItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
