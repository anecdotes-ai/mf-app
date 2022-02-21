import { ThreadStateEnum } from '@anecdotes/commenting';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'core/modules/auth-core/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs/internal/observable/of';
import { CommentingFacadeService, CommentPanelManagerService } from '../../services';
import { ThreadCreationComponent } from './thread-creation.component';

describe('ThreadCreationComponent', () => {
  configureTestSuite();

  let component: ThreadCreationComponent;
  let fixture: ComponentFixture<ThreadCreationComponent>;
  let commentPanelManagerService: CommentPanelManagerService;
  let authService: AuthService;
  let commentingFacadeServiceMock: CommentingFacadeService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ThreadCreationComponent],
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: CommentPanelManagerService, useValue: {} },
          { provide: AuthService, useValue: {} },
          { provide: CommentingFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadCreationComponent);
    component = fixture.componentInstance;

    component.resourceToCreateThreadFor = {
      threadId: 'id1',
      threadState: ThreadStateEnum.Resolved,
      resourceTypeDisplayName: 'typeDisplayName1',
      resourceType: 'resType1',
      resourceDisplayName: 'resDispName1',
      resourceId: 'resId1',
    };

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    commentingFacadeServiceMock = TestBed.inject(CommentingFacadeService);
    commentingFacadeServiceMock.createThreadAsync = jasmine.createSpy('createThreadAsync').and.callFake(() => Promise.resolve());
    authService = TestBed.inject(AuthService);
    authService.getUser = jasmine.createSpy('getUser');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should set currentUser stream', async () => {
      // Arrange
      authService.getUser = jasmine.createSpy('getUser').and.returnValue(of()); 
      
      // Act
      await detectChanges(); 
      
      // Assert
      expect(authService.getUser).toHaveBeenCalled();
      expect(component.currentUser$).toBeTruthy();
    });
  });

  describe('commentClick', () => {
    it('should emit creationInProgress values', async () => {
      // Arrange
      spyOn(component.creationInProgress$, 'next'); 
      
      // Act
      await component.commentClick(); 
      
      // Assert
      expect(component.creationInProgress$.next).not.toHaveBeenCalledOnceWith(true);
      expect(component.creationInProgress$.next).toHaveBeenCalledWith(true);
      expect(component.creationInProgress$.next).toHaveBeenCalledTimes(2);
    });

    it('should create tread with proper values', async () => {
      // Arrange
      component.textControl = new FormControl(null, Validators.required);

      component.resourceToCreateThreadFor = component.resourceToCreateThreadFor = {
        threadId: 'id1',
        threadState: ThreadStateEnum.Resolved,
        resourceTypeDisplayName: 'typeDisplayName1',
        resourceType: 'resType1',
        resourceDisplayName: 'resDispName1',
        resourceId: 'resId1',
      }; 
      
      // Act
      await component.commentClick(); 
      
      // Assert
      expect(commentingFacadeServiceMock.createThreadAsync).toHaveBeenCalledWith(
        component.resourceToCreateThreadFor.resourceType,
        component.resourceToCreateThreadFor.resourceId,
        component.textControl.value);
    });

    it('should not emit created and call close', async () => {
      // Arrange
      commentingFacadeServiceMock.createThreadAsync = jasmine.createSpy('createThreadAsync').and.returnValue(Promise.reject());
      component.created.emit = jasmine.createSpy('emit');
      commentPanelManagerService.closeCreation = jasmine.createSpy('closeCreation'); 
      
      // Act
      await component.commentClick(); 
      
      // Assert
      expect(component.created.emit).not.toHaveBeenCalled();
      expect(commentPanelManagerService.closeCreation).not.toHaveBeenCalled();
    });
  });

  describe('cancelClick', () => {
    it('should call closeCreation', async () => {
      // Arrange
      commentPanelManagerService.closeCreation = jasmine.createSpy('closeCreation'); 
      
      // Act
      component.cancelClick(); 
      
      // Assert
      expect(commentPanelManagerService.closeCreation).toHaveBeenCalled();
    });
  });

  describe('buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key'; 
      
      // Act
      const actual = component.buildTranslationKey(relativeKey); 
      
      // Assert
      expect(actual).toEqual(`commenting.${relativeKey}`);
    });
  });
});
