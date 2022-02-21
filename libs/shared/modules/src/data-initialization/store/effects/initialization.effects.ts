import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { UserService } from 'core/modules/auth-core/services';
import { UsersLoadedAction } from 'core/modules/auth-core/store';
import {
  ControlsService,
  CustomerService,
  EvidenceService,
  FrameworkService,
  PluginService,
  PolicyService,
  RequirementService
} from 'core/modules/data/services';
import {
  ControlRequirementsLoadedAction,
  ControlsLoadedAction,
  CustomerLoadedAction,
  EvidencesLoadedAction,
  FrameworksLoadedAction,
  PoliciesLoadedAction,
  ServicesLoadedAction
} from 'core/modules/data/store/actions';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { AppInitializedAction, InitializationActionType } from '../actions';

@Injectable()
export class InitializationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private frameworksHttpService: FrameworkService,
    private controlsHttpService: ControlsService,
    private requirementHttpService: RequirementService,
    private policyHttpService: PolicyService,
    private evidenceHttpService: EvidenceService,
    private pluginService: PluginService,
    private customerService: CustomerService,
    private userHttpService: UserService
  ) {}

  @Effect({ dispatch: false })
  init$ = this.actions$.pipe(
    ofType(InitializationActionType.InitApp),
    take(1),
    mergeMap(() =>
      forkJoin(
        this.getInitActions().map((action$) =>
          action$.pipe(
            catchError((_) => of({}))
          )
        )
      )
    ),
    tap((actions: Action[]) => actions.filter((action) => action.type).forEach(action => this.store.dispatch(action))),
    tap(() => this.store.dispatch(new AppInitializedAction()))
  );

  private getInitActions(): Observable<Action>[] {
    return [
      this.getFrameworks(),
      this.getControls(),
      this.getRequirements(),
      this.getEvidence(),
      this.getPlugins(),
      this.getPolicies(),
      this.getCustomer(),
      this.getUsers()
    ];
  }

  private getFrameworks(): Observable<FrameworksLoadedAction> {
    return this.frameworksHttpService
      .getAllFrameworks()
      .pipe(map((frameworks) => new FrameworksLoadedAction(frameworks)));
  }

  private getControls(): Observable<ControlsLoadedAction> {
    return this.controlsHttpService.getControls().pipe(map((controls) => new ControlsLoadedAction(controls)));
  }

  private getRequirements(): Observable<ControlRequirementsLoadedAction> {
    return this.requirementHttpService
      .getRequirements()
      .pipe(map((requirements) => new ControlRequirementsLoadedAction(requirements)));
  }

  private getPolicies(): Observable<PoliciesLoadedAction> {
    return this.policyHttpService.getPolicies().pipe(map((policies) => new PoliciesLoadedAction(policies)));
  }

  private getEvidence(): Observable<EvidencesLoadedAction> {
    return this.evidenceHttpService.getEvidences().pipe(map((evidences) => new EvidencesLoadedAction(evidences)));
  }

  private getPlugins(): Observable<ServicesLoadedAction> {
    return this.pluginService.getAllServices().pipe(map((plugins) => new ServicesLoadedAction(plugins)));
  }

  private getCustomer(): Observable<CustomerLoadedAction> {
    return this.customerService.getCustomer().pipe(map((customer) => new CustomerLoadedAction(customer)));
  }

  private getUsers(): Observable<UsersLoadedAction> {
    return this.userHttpService.getAllUsers().pipe(map(users => new UsersLoadedAction(users)));
  }
}
