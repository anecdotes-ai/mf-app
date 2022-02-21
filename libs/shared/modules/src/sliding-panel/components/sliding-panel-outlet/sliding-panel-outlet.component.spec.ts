import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommentPanelManagerService } from 'core/modules/commenting';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { SlidingPanelOutletComponent } from './sliding-panel-outlet.component';

describe('SlidingPanelOutletComponent', () => {
  let component: SlidingPanelOutletComponent;
  let fixture: ComponentFixture<SlidingPanelOutletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidingPanelOutletComponent ],
      providers: [
        { provide: DataFilterManagerService, useValue: {}},
        { provide: CommentPanelManagerService, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingPanelOutletComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
