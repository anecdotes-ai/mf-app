import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardData } from 'core/models/dashboard-data.model';
import { ControlsFacadeService } from '../controls-facade/controls-facade.service';
import { FrameworksFacadeService } from '../frameworks-facade/frameworks-facade.service';
import { PluginFacadeService } from '../plugin-facade/plugin-facade.service';
import { State } from '../../../store/state';
import { selectDashboardAfterInit } from '../../../store/selectors';
import { generateControls } from 'core/utils/generate-controls.function';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, shareReplay } from 'rxjs/operators';

@Injectable()
export class DashboardFacadeService {
  constructor(
    private store: Store<State>,
    private controlsFacade: ControlsFacadeService,
    private frameworksFacade: FrameworksFacadeService,
    private pluginFacade: PluginFacadeService
  ) {}

  getDashboardInit(): Observable<boolean> {
    return this.store.pipe(selectDashboardAfterInit, shareReplay());
  }

  getDashboardData(): Observable<DashboardData> {
    return combineLatest([
      this.frameworksFacade.getFrameworks(),
      this.frameworksFacade.getApplicableFrameworks(),
      this.controlsFacade.getFrameworkControlsDictionary(),
      this.pluginFacade.getAllServices(),
      this.controlsFacade.controlsFrameworksMapping$,
    ]).pipe(
      debounceTime(50),
      map((res) => {
        const frameworks = res[0];
        const applicableFrameworksIds = res[1].map((f) => f.framework_id);
        const controlsByFramework = res[2];
        const services = res[3];
        const controlsFrameowrksMapping = res[4];

        const anecdotesControls = generateControls(applicableFrameworksIds, controlsByFramework);
        const frameworksControls = generateControls(applicableFrameworksIds, controlsByFramework, false);

        return {
          controlsFrameworksMapping: controlsFrameowrksMapping,
          services: services,
          anecdotesControls: anecdotesControls,
          frameworksControls: frameworksControls,
          frameworks: frameworks,
          applicableFrameworksIds: applicableFrameworksIds,
        } as DashboardData;
      }),
      shareReplay()
    );
  }
}
