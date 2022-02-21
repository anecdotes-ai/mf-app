import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommentPanelManagerService } from '../../services';
import { CommentingPannelButtonComponent } from './commenting-pannel-button.component';

describe('CommentingPannelButtonComponent', () => {
  let component: CommentingPannelButtonComponent;
  let fixture: ComponentFixture<CommentingPannelButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CommentingPannelButtonComponent],
        imports: [TranslateModule.forRoot()],
        providers: [{ provide: CommentPanelManagerService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentingPannelButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
