import { VirtualScrollRendererComponent } from 'core/modules/rendering/components/virtual-scroll-renderer/virtual-scroll-renderer.component';
import { CategoryHeader } from './../../models/category-header.modal';
import { Policy } from 'core/modules/data/models/domain';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';
import { SubscriptionDetacher } from 'core/utils';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { take } from 'rxjs/operators';
import { VScrollListEntity } from '../../models';
import { Observable } from 'rxjs/internal/Observable';

export const VIRTUAL_SCROLL_BUFFER = 15;

@Component({
  selector: 'app-policies-renderer',
  templateUrl: './policies-renderer.component.html',
  styleUrls: ['./policies-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesRendererComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  // ** SUBSCRIPTIONS **
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  // ** DATA **
  entitiesIdsToExpand: { [entityId: string]: boolean } = {};
  newlyAddedEntities: { [entityId: string]: boolean } = {};
  virtualScrollBuffer = VIRTUAL_SCROLL_BUFFER;
  parentScrollElement: HTMLElement;

  header = 'policyManager.myPolicies';

  policyOrCategoryIdSelector = this.selectIdFromPolicyOrCategory.bind(this);

  // ** INPUTS / OUTPUTS **
  @Input() displayedData$: Observable<VScrollListEntity<CalculatedPolicy>[]>;

  @Input() parentScroller: PerfectScrollbarComponent;

  @Input() idPropertyName: string; // for the trackBy Function

  @Output() rendered = new EventEmitter();

  // ** VIEW CHILD/REN **
  @ViewChildren('entityWrapper')
  private renderedWrappers: QueryList<ElementRef<HTMLDivElement>>;

  @ViewChild(VirtualScrollRendererComponent)
  private virtualScroller: VirtualScrollRendererComponent;

  constructor() {}

  ngOnInit(): void {
    this.parentScrollElement = this.parentScroller?.directiveRef?.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.handleRendering();
  }

  // **** INIT HANDLES ****

  private handleRendering(): void {
    this.renderedWrappers.notifyOnChanges();
    this.renderedWrappers.changes.pipe(take(1), this.detacher.takeUntilDetach()).subscribe(() => {
      this.rendered.emit();
    });
  }

  trackByFnWithIndex(_: number, entity: T): string {
    return this.entityTrackByFn(entity);
  }

  entityTrackByFn(entity: T): string {
    return entity[this.idPropertyName];
  }

  // **** EXPANSION ****

  // we save the expand state for virtual scroll,
  // to open the item when we scroll away and then back to it.
  entityExpanded(entity: T, isExpanded: boolean): void {
    const entityId = this.entityTrackByFn(entity);

    if (this.wasEntityOpened(entityId, isExpanded)) {
      this.entitiesIdsToExpand[entityId] = true;
    } else if (this.wasEntityClosed(entityId, isExpanded)) {
      delete this.entitiesIdsToExpand[entityId];
    }
  }

  isEntityExpanded(entity: T): boolean {
    return this.entitiesIdsToExpand[this.entityTrackByFn(entity)];
  }

  private wasEntityClosed(entityId: string, isExpanded: boolean): boolean {
    return entityId in this.entitiesIdsToExpand && !isExpanded;
  }

  private wasEntityOpened(entityId: string, isExpanded: boolean): boolean {
    return !(entityId in this.entitiesIdsToExpand) && isExpanded;
  }

  // **** TRACK BY ****

  scrollableTrackBy(_: number, item: VScrollListEntity<T>): string {
    return item?.isEntity
      ? this.entityTrackByFn(item.entityOrHeader as T)
      : (item.entityOrHeader as CategoryHeader).translationKey;
  }

  // **** METHODS USED BY VIEW ****

  scrollToItem(element: VScrollListEntity<T>): void {
    this.virtualScroller.scrollInto(element);
  }

  markAsAdded(elementId: string): void {
    this.newlyAddedEntities[elementId] = true;
  }

  handleClickedEntity(entity: T): void {
    // Sets the entity to be marked as *not* new anymore
    delete this.newlyAddedEntities[this.entityTrackByFn(entity)];
  }

  isEntityNewlyAdded(entity: T): boolean {
    return this.newlyAddedEntities[this.entityTrackByFn(entity)];
  }

  buildTranslationKey(relativeKey: string): string {
    return `policyManager.policyRenderer.${relativeKey}`;
  }

  buildRenderingItems(items: VScrollListEntity<CalculatedPolicy>[]): VScrollListEntity<CalculatedPolicy>[] {
    if (!items.length) {
      return [];
    }

    const approvedGroup = items.filter(
      (value) => (value.entityOrHeader as CalculatedPolicy).status === ResourceStatusEnum.APPROVED
    );
    const approvedHeader: VScrollListEntity<CalculatedPolicy> = {
      entityOrHeader: {
        count: approvedGroup.length,
        translationKey: this.buildTranslationKey('approved'),
        isCategory: true,
      },
      isEntity: false,
      headerContext: { count: approvedGroup.length },
    };

    const inProgress = items.filter(
      (value) =>
        (value.entityOrHeader as CalculatedPolicy).status !== ResourceStatusEnum.APPROVED &&
        (value.entityOrHeader as CalculatedPolicy).status !== ResourceStatusEnum.UNDEFINED
    );
    const inProgressHeader: VScrollListEntity<CalculatedPolicy> = {
      entityOrHeader: {
        count: inProgress.length,
        translationKey: this.buildTranslationKey('inProgress'),
        isCategory: true,
      },
      headerContext: { count: inProgress.length },
      isEntity: false,
    };

    const emptyGroup = items.filter(
      (value) => (value.entityOrHeader as CalculatedPolicy).status === ResourceStatusEnum.UNDEFINED
    );
    const emptyHeader: VScrollListEntity<CalculatedPolicy> = {
      entityOrHeader: {
        count: emptyGroup ? emptyGroup.length : 0,
        translationKey: this.buildTranslationKey('empty'),
        isCategory: true,
      },
      isEntity: false,
      headerContext: { count: emptyGroup.length },
    };

    const apppovedPart = approvedGroup.length ? [approvedHeader, ...approvedGroup] : [];
    const inProgressPart = inProgress.length ? [inProgressHeader, ...inProgress] : [];
    const emptyPart = emptyGroup.length ? [emptyHeader, ...emptyGroup] : [];

    return [...apppovedPart, ...inProgressPart, ...emptyPart];
  }

  private selectIdFromPolicyOrCategory(item: any): string {
    if (!item.isEntity) {
      return item as string;
    }

    return (item.entityOrHeader as Policy).policy_id;
  }

  // **** DESTROY ****

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
