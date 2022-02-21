import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommentPanelManagerService, CommentingFacadeService } from '../../services';
import { ThreadItemComponent } from './thread-item.component';

describe('ThreadItemComponent', () => {
  let component: ThreadItemComponent;
  let fixture: ComponentFixture<ThreadItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ThreadItemComponent],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: CommentingFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
