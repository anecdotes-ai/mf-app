import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, NEVER, of } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';
import { GlobalLoaderComponent, LOADING_TIMEOUT } from './global-loader.component';

describe('GlobalLoaderComponent', () => {
  configureTestSuite();

  let component: GlobalLoaderComponent;
  let fixture: ComponentFixture<GlobalLoaderComponent>;
  const loaderStream$ = new BehaviorSubject(false);

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GlobalLoaderComponent],
        imports: [CommonModule, TranslateModule.forRoot()],
        providers: [{ provide: LoaderManagerService, useValue: { loaderStream$: loaderStream$.pipe() } }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLoaderComponent);
    component = fixture.componentInstance;
    component.delay = jasmine.createSpy('delay').and.callFake(() => switchMapTo(of(true)));
    loaderStream$.next(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loader display', () => {
    function getWrapperDebugElement(): DebugElement {
      return fixture.debugElement.query(By.css('div.wrapper'));
    }

    it('should not render wrapper when loader is hidden', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(getWrapperDebugElement()).toBeFalsy();
    });

    it('should render wrapper when loader is shown', () => {
      // Arrange
      // Act
      fixture.detectChanges();
      loaderStream$.next(true);
      fixture.detectChanges();

      // Assert
      expect(getWrapperDebugElement()).toBeTruthy();
    });
  });

  describe('long loading time text display', () => {
    function getLongLoadingTextDebugElement(): DebugElement {
      return fixture.debugElement.query(By.css('div.long-loading-text'));
    }

    it('should not render div.long-loading-text after loader shown', () => {
      // Assert
      component.delay = jasmine.createSpy('delay').and.callFake(() => switchMapTo(NEVER));

      // Act
      fixture.detectChanges();
      loaderStream$.next(true);
      fixture.detectChanges();

      // Assert
      expect(getLongLoadingTextDebugElement()).toBeFalsy();
    });

    it(
      `should render div.long-loading-text after loader has already been shown after ${LOADING_TIMEOUT} seconds`,
      fakeAsync(() => {
        // Arrange
        // Act
        fixture.detectChanges();
        tick(500);
        loaderStream$.next(true);
        fixture.detectChanges();
        tick(500);

        // Assert
        expect(getLongLoadingTextDebugElement()).toBeTruthy();
      }
    ));

    it(
      `should not render div.long-loading-text after loader hide`,
      async () => {
        // Act
        fixture.detectChanges();
        loaderStream$.next(true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        loaderStream$.next(false);
        fixture.detectChanges();

        // Assert
        expect(getLongLoadingTextDebugElement()).toBeFalsy();
      }
    );
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`core.globalLoader.${relativeKey}`);
    });
  });
});
