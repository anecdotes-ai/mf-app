import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { ControlsStatusBarComponent } from './controls-status-bar.component';

describe('ControlsStatusBarComponent', () => {
  configureTestSuite();

  let component: ControlsStatusBarComponent;
  let fixture: ComponentFixture<ControlsStatusBarComponent>;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ControlsStatusBarComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsStatusBarComponent);
    component = fixture.componentInstance;
  });
});
