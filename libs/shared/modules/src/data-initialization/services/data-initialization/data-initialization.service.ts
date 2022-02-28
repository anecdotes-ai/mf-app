import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LoaderManagerService } from 'core/services';
import { filter, take } from 'rxjs/operators';
import { InitializeAppAction } from '../../store/actions';
import { selectInitState } from '../../store/selectors';

@Injectable()
export class DataInitalizationCanActivate implements CanActivate {
  constructor(
    private store: Store,
    private actions$: Actions,
    private loaderManager: LoaderManagerService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.loaderManager.show();
    this.store.dispatch(new InitializeAppAction());
    await this.store
      .select((x) => selectInitState(x))
      .pipe(filter(x => x.isAppLoaded),take(1))
      .toPromise();
    this.loaderManager.hide();
    return true;
  }
}
