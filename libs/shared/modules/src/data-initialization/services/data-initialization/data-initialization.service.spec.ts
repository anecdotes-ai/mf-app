import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoaderManagerService } from 'core';
import { from, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { featureKey, InitState } from '../../store';
import { InitializeAppAction } from '../../store/actions';
import { DataInitalizationCanActivate } from './data-initialization.service';

const initState: InitState = {
  isAppLoaded: false,
};

describe('DataInitalizationCanActivate', () => {
  let serviceUnderTest: DataInitalizationCanActivate;
  let mockStore: MockStore;
  let loaderManagerServiceMock: LoaderManagerService;
  const actionsMock: Subject<any> = new Subject();
  let fakeActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let fakeRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataInitalizationCanActivate,
        provideMockStore(),
        { provide: Actions, useValue: actionsMock },
        { provide: LoaderManagerService, useValue: {} },
      ],
    });
    serviceUnderTest = TestBed.inject(DataInitalizationCanActivate);
    loaderManagerServiceMock = TestBed.inject(LoaderManagerService);
    mockStore = TestBed.inject(MockStore);
    mockStore.setState({
      [featureKey]: { initState },
    });
    mockStore.dispatch = jasmine.createSpy('dispatch');
    loaderManagerServiceMock.show = jasmine.createSpy('show');
    loaderManagerServiceMock.hide = jasmine.createSpy('hide');
    fakeActivatedRouteSnapshot = {} as any;
    fakeRouterStateSnapshot = {} as any;
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  it('should show loader', () => {
    // Arrange
    // Act
    serviceUnderTest.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot);

    // Assert
    expect(loaderManagerServiceMock.show).toHaveBeenCalledWith();
  });

  it('should dispatch InitializeAppAction', () => {
    // Arrange
    // Act
    serviceUnderTest.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot);

    // Assert
    expect(mockStore.dispatch).toHaveBeenCalledWith(new InitializeAppAction());
  });

  it('should not resolve until initState is not true', (done) => {
    // Arrange
    const spy = jasmine.createSpy('spy');

    from(serviceUnderTest.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot))
      .pipe(take(1))
      .subscribe(spy);

    // Assert
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 500);
  });

  it('should resolve when initState is true', (done) => {
    // Arrange
    const spy = jasmine.createSpy('spy');

    from(serviceUnderTest.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot))
      .pipe(take(1))
      .subscribe(spy);

    // Act
    mockStore.setState({ [featureKey]: { initState: { isAppLoaded: true } } });
    mockStore.refreshState();

    // Assert
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('should hide loader after initState is true', fakeAsync(() => {
    // Arrange
    // Act
    serviceUnderTest.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot);
    mockStore.setState({ [featureKey]: { initState: { isAppLoaded: true } } });
    mockStore.refreshState();
    tick(100);

    // Assert
    expect(loaderManagerServiceMock.hide).toHaveBeenCalled();
  }));

  it('should return true', async () => {
    // Arrange
    // Act
    const taskToAwait = serviceUnderTest.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot);
    mockStore.setState({ [featureKey]: { initState: { isAppLoaded: true } } });
    mockStore.refreshState();
    const actualResult = await taskToAwait;

    // Assert
    expect(actualResult).toBeTrue();
  });
});
