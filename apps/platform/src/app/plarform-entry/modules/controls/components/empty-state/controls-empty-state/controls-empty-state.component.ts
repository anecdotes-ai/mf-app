import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { AccountFeatureEnum, Framework } from 'core/modules/data/models/domain';
import { ActionDispatcherService, FrameworksFacadeService, TrackOperations } from 'core/modules/data/services';
import { StartWithAnecdotesEssentialsAction, StartWithFrameworksAdoptionAction } from 'core/modules/data/store/actions';
import { Observable } from 'rxjs';
import { BadgeColorTypes } from '../models';

/**
 * @deprecated Since we entroduced evidence pool and we have no my controls page anymore, this is deprecated.
 */
@Component({
  selector: 'app-controls-empty-state',
  templateUrl: './controls-empty-state.component.html',
  styleUrls: ['./controls-empty-state.component.scss'],
})
export class ControlsEmptyStateComponent implements OnInit, OnDestroy {
  @Output()
  startedWithAnecdotesEssentials = new EventEmitter();

  @Output()
  startedWithFrameworksAdoption = new EventEmitter<Framework[]>();

  badgeColorTypes = BadgeColorTypes;
  features = AccountFeatureEnum;

  anecdotesUnifiedFrameworkId = AnecdotesUnifiedFramework.framework_id;
  anecdotesUnifiedControlsCount = 5;
  anecdotesUnifiedFrameworkName = 'anecdotes basics';

  selectedFrameworks = new Set<Framework>();
  isStartWithAnecdotesLoading = false;
  isStartWithFrameworkAdoptionLoading = false;

  frameworks$: Observable<Framework[]>;

  constructor(private actionDispatcher: ActionDispatcherService, private frameworksFacade: FrameworksFacadeService) {}

  ngOnDestroy(): void {
    this.isStartWithAnecdotesLoading = false;
    this.isStartWithFrameworkAdoptionLoading = false;
  }

  ngOnInit(): void {
    this.frameworks$ = this.frameworksFacade.getAvailableFrameworks();
  }

  buildTranslationKey(relativeKey: string): string {
    return `controls.emptyState.${relativeKey}`;
  }

  selectFramework(framework: Framework): void {
    if (this.selectedFrameworks.has(framework)) {
      this.selectedFrameworks.delete(framework);
    } else {
      this.selectedFrameworks.add(framework);
    }
  }

  async startWithAnecdotesEssentials(): Promise<void> {
    this.isStartWithAnecdotesLoading = true;

    try {
      await this.actionDispatcher.dispatchActionAsync(
        new StartWithAnecdotesEssentialsAction(),
        TrackOperations.STARTED_WITH_ANECDOTES_ESSENTIALS
      );
      this.startedWithAnecdotesEssentials.emit();
    } catch (err) {
      this.isStartWithAnecdotesLoading = false;
    }
  }

  async startWithFrameworkAdoption(): Promise<void> {
    this.isStartWithFrameworkAdoptionLoading = true;
    const frameworks = Array.from(this.selectedFrameworks);

    try {
      await this.actionDispatcher.dispatchActionAsync(
        new StartWithFrameworksAdoptionAction(frameworks),
        TrackOperations.STARTED_WITH_FRAMEWORKS_ADOPTION
      );
      this.startedWithFrameworksAdoption.emit(frameworks);
    } catch (err) {
      this.isStartWithFrameworkAdoptionLoading = false;
    }
  }
}
