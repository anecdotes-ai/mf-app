import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserClaims } from 'core/modules/auth-core/models';
import { AuthService } from 'core/modules/auth-core/services';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThreadViewModel } from '../../models';
import { CommentingFacadeService, CommentPanelManagerService } from '../../services';
import { CommentInputValue } from '@anecdotes/commenting';

@Component({
  selector: 'app-thread-creation',
  templateUrl: './thread-creation.component.html',
  styleUrls: ['./thread-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadCreationComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @HostBinding('class')
  private classes =
    'flex flex-col rounded-md border border-solid border-navy-90 border-opacity-30 overflow-hidden bg-white';
  creationInProgress$ = new BehaviorSubject<boolean>(false);

  @Input()
  resourceToCreateThreadFor: ThreadViewModel;

  /**
   * Emits thread id of created thread
   */
  @Output()
  created = new EventEmitter<string>();

  textControl = new FormControl(null, Validators.required);
  currentUser$: Observable<UserClaims>;

  constructor(
    private commentingFacadeService: CommentingFacadeService,
    private commentPanelManager: CommentPanelManagerService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser();
    this.textControl.statusChanges.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.cd.detectChanges());
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async commentClick(): Promise<void> {
    this.creationInProgress$.next(true);

    try {
      const createdThread = await this.commentingFacadeService.createThreadAsync(
        this.resourceToCreateThreadFor.resourceType,
        this.resourceToCreateThreadFor.resourceId,
        this.textControl.value as CommentInputValue
      );
      this.created.emit(createdThread.id);
      this.commentPanelManager.closeCreation();
    } catch (error) {
      // TODO
    } finally {
      this.creationInProgress$.next(true);
    }
  }

  cancelClick(): void {
    this.commentPanelManager.closeCreation();
  }

  buildTranslationKey(relativeKey: string): string {
    return `commenting.${relativeKey}`;
  }
}
