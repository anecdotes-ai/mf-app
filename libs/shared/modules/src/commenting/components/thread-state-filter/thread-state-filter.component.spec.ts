import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommentPanelManagerService } from '../../services';
import { ThreadStateFilterComponent, activeOption, resolvedOption } from './thread-state-filter.component';
import { ThreadStateEnum } from '@anecdotes/commenting';
import { configureTestSuite } from 'ng-bullet';

describe('ThreadStateFilterComponent', () => {
  configureTestSuite();

  let component: ThreadStateFilterComponent;
  let fixture: ComponentFixture<ThreadStateFilterComponent>;
  let commentPanelManagerService: CommentPanelManagerService;
  let translateService: TranslateService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [ThreadStateFilterComponent],
        providers: [{ provide: CommentPanelManagerService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadStateFilterComponent);
    component = fixture.componentInstance;

    commentPanelManagerService = TestBed.inject(CommentPanelManagerService);
    commentPanelManagerService.getStateThreadsDisplayedBy = jasmine.createSpy('getStateThreadsDisplayedBy');

    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should call setvalue with active option when state is active', async () => {
      // Arrange
      commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
        .createSpy('getStateThreadsDisplayedBy')
        .and.returnValue(of(ThreadStateEnum.Active));
      spyOn(component.control, 'setValue');

      // Act
      await detectChanges();

      // Assert
      expect(component.control.setValue).toHaveBeenCalledWith(activeOption, { emitEvent: false });
    });

    it('should call setvalue with resolved option when state isnt active', async () => {
      // Arrange
      commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
        .createSpy('getStateThreadsDisplayedBy')
        .and.returnValue(of(ThreadStateEnum.Resolved));
      spyOn(component.control, 'setValue');

      // Act
      await detectChanges();

      // Assert
      expect(component.control.setValue).toHaveBeenCalledWith(resolvedOption, { emitEvent: false });
    });

    it('should call displayActiveThreads when controls value changes with active state option', async () => {
      // Arrange
      commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
        .createSpy('getStateThreadsDisplayedBy')
        .and.returnValue(of());
      commentPanelManagerService.displayActiveThreads = jasmine.createSpy('displayActiveThreads');

      // Act
      await detectChanges();
      component.control.setValue(activeOption);

      // Assert
      expect(commentPanelManagerService.displayActiveThreads).toHaveBeenCalled();
    });

    it('should call displayResolvedThreads when controls value changes with resolved state option', async () => {
      // Arrange
      commentPanelManagerService.getStateThreadsDisplayedBy = jasmine
        .createSpy('getStateThreadsDisplayedBy')
        .and.returnValue(of());
      commentPanelManagerService.displayActiveThreads = jasmine.createSpy('displayActiveThreads');

      // Act
      await detectChanges();
      component.control.setValue(activeOption);

      // Assert
      expect(commentPanelManagerService.displayActiveThreads).toHaveBeenCalled();
    });
  });

  describe('displayValueSelector', () => {
    it('should call instant of translateService', async () => {
      // Arrange
      translateService.instant = jasmine.createSpy('instant');

      // Act
      component.displayValueSelector(activeOption);

      // Assert
      expect(translateService.instant).toHaveBeenCalledWith(activeOption.displayValue);
    });
  });

  describe('filterOptions', () => {
    it('should be setted with proper values', async () => {
      // Arrange
      // Act
      // Assert
      expect(component.filterOptions).toEqual([activeOption, resolvedOption]);
    });
  });
});
