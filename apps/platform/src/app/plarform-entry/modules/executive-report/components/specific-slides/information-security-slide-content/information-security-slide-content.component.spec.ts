import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSecSlideContentComponent } from './information-security-slide-content.component';
import { InformationSecuritySlideContent } from '../models';

describe('InformationSecuritySlideContentComponent', () => {
  let component: InfoSecSlideContentComponent;
  let fixture: ComponentFixture<InfoSecSlideContentComponent>;

  let mockInputData: InformationSecuritySlideContent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoSecSlideContentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockInputData = { allCategories: [], frameworksCategories: [] };

    fixture = TestBed.createComponent(InfoSecSlideContentComponent);
    component = fixture.componentInstance;
    component.data = mockInputData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
