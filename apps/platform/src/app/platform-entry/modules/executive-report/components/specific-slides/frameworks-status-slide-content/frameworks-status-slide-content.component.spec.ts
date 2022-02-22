import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlsFacadeService, FrameworkService } from 'core/modules/data/services';
import { FrameworksStatusSlideContentComponent } from './frameworks-status-slide-content.component';
import { FrameworksStatusSlideContentData } from '../models';

describe('FrameworksStatusSlideContentComponent', () => {
  let component: FrameworksStatusSlideContentComponent;
  let fixture: ComponentFixture<FrameworksStatusSlideContentComponent>;

  let mockInputData: FrameworksStatusSlideContentData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FrameworksStatusSlideContentComponent],
      providers: [FrameworkService, { provide: ControlsFacadeService, useValue: {} }],
      imports: [HttpClientModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockInputData = { frameworks: [] };

    fixture = TestBed.createComponent(FrameworksStatusSlideContentComponent);
    component = fixture.componentInstance;
    component.data = mockInputData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
