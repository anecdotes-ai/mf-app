import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { EvidenceCollectionMessages } from 'core/services/message-bus/constants/evidence-collection-messages.constants';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { CollectingEvidence } from 'core/modules/data/models';
import { SubscriptionDetacher } from 'core/utils';
import { EvidenceCollectionSkeletonComponent } from '../../components';
import { Subscription } from 'rxjs';

interface SkeletonCachedData {
  subscriptions: Subscription[];
  componentRef: ComponentRef<EvidenceCollectionSkeletonComponent>;
  collectingEvidence: CollectingEvidence;
}

@Directive({
  selector: '[collectingEvidenceHost]',
  exportAs: 'collectingEvidenceHost',
})
export class CollectingEvidenceHostDirective implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private dictionary: { [key: string]: SkeletonCachedData } = {};
  private skeletonComponentFactory: ComponentFactory<EvidenceCollectionSkeletonComponent>;

  @Input()
  resourceId: string;

  @Output()
  collectionStarted = new EventEmitter();

  @Output()
  tryAgain = new EventEmitter();

  get collectingEvidences(): CollectingEvidence[] {
    return Object.keys(this.dictionary).map((key) => this.dictionary[key].collectingEvidence);
  }

  get isCollectionInProgress(): boolean {
    return !!this.collectingEvidences.length;
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageBus: MessageBusService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.skeletonComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      EvidenceCollectionSkeletonComponent
    );

    this.messageBus
      .getObservable<CollectingEvidence[]>(EvidenceCollectionMessages.COLLECTION_STARTED, this.resourceId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((collectingEvidences) => {
        this.createSkeletones(collectingEvidences);
        this.collectionStarted.emit();
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    Object.keys(this.dictionary).forEach((skeletonCacheId) => this.cleanUpSkeleton(skeletonCacheId));
  }

  private createSkeletones(collectingEvidences: CollectingEvidence[]): void {
    collectingEvidences.forEach((collectingEvidence) => {
      const collectingEvidenceId = this.getCollectingEvidenceId(collectingEvidence);
      if (!this.dictionary[collectingEvidenceId]) {
        this.createComponentRef(collectingEvidence);
      }
    });
  }

  private createComponentRef(
    collectingEvidence: CollectingEvidence
  ): ComponentRef<EvidenceCollectionSkeletonComponent> {
    const cacheId = this.getCollectingEvidenceId(collectingEvidence);
    const componentRef = this.viewContainerRef.createComponent(this.skeletonComponentFactory, 0);
    const evidenceCollectionEndSubscription = componentRef.instance.evidenceCollectionEnd.subscribe(() =>
      this.cleanUpSkeleton(cacheId)
    );
    const tryAgainSubscription = componentRef.instance.tryAgain.subscribe(() => this.tryAgain.emit());
    this.dictionary[cacheId] = {
      collectingEvidence,
      componentRef,
      subscriptions: [tryAgainSubscription, evidenceCollectionEndSubscription],
    };

    componentRef.instance.collectingEvidence = collectingEvidence;
    componentRef.instance.resourceId = this.resourceId;
    componentRef.instance.numberOfEvidences = this.collectingEvidences.length;

    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  private cleanUpSkeleton(id: string): void {
    const skeletonCachedData = this.dictionary[id];

    if (!skeletonCachedData) {
      return;
    }

    const viewIndex = this.viewContainerRef.indexOf(skeletonCachedData.componentRef.hostView);

    if (viewIndex >= 0) {
      this.viewContainerRef.remove(viewIndex);
    }

    skeletonCachedData.componentRef.destroy();
    skeletonCachedData.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private getCollectingEvidenceId(collectingEvidence: CollectingEvidence): string {
    return collectingEvidence.temporaryId || collectingEvidence.evidenceId;
  }
}
