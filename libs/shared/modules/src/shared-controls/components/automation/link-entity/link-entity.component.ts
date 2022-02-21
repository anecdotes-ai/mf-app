import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownControl } from 'core/models';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { NameEntity } from 'core/modules/data/models';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LinkEntityIds, LinkEntityModalInputFields } from '../constants';

@Component({
  selector: 'app-link-entity',
  templateUrl: './link-entity.component.html',
  styleUrls: ['./link-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkEntityComponent<T> implements OnInit, OnDestroy {
  @Input(LinkEntityModalInputFields.parentResourceId)
  parentResourceId: string;
  @Input(LinkEntityModalInputFields.icon)
  icon: string;
  @Input(LinkEntityModalInputFields.cornerTitle)
  cornerTitle: string;
  @Input(LinkEntityModalInputFields.entities)
  entities: Observable<NameEntity<T>[]>;
  @Input(LinkEntityModalInputFields.linkEntityToParent)
  linkEntityToParent: (
    entityId: string
  ) => Promise<any>;
  translationRootKey: string;
  @Input(LinkEntityModalInputFields.helpLink)
  helpLink: string;

  isLoading: boolean;
  formGroup: DynamicFormGroup<any>;

  private detacher = new SubscriptionDetacher();

  constructor(private cd: ChangeDetectorRef, private switcher: ComponentSwitcherDirective) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  async ngOnInit(): Promise<void> {
    this.translationRootKey = await this.switcher.sharedContext$
      ?.pipe(
        map((shared) => shared.translationKey),
        take(1)
      )
      .toPromise();
    this.entities.pipe(this.detacher.takeUntilDetach()).subscribe((entities) => {
      this.initFormGroup(entities);
      this.enrichForm();
      this.cd.detectChanges();
    });
  }

  buildTranslationKey(relativeKey: string): string {
    return `${this.translationRootKey}.${relativeKey}`;
  }

  async linkItemToParent(): Promise<void> {
    this.isLoading = true;
    this.cd.detectChanges();

    try {
      await this.linkEntityToParent(
        this.formGroup.items.item.value.id
      );
      this.switcher.goById(LinkEntityIds.SuccessModal);
    } catch (e) {
      this.switcher.goById(LinkEntityIds.ErrorModal);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private initFormGroup(entities: NameEntity<T>[]): void {
    this.formGroup = new DynamicFormGroup({
      item: new DropdownControl({
        initialInputs: {
          data: entities,
          searchEnabled: true,
          displayValueSelector: (item) => item.name,
        },
        validators: [Validators.required],
      }),
    });
  }

  private enrichForm(): void {
    this.formGroup.items.item.inputs.searchFieldPlaceholder = this.buildTranslationKey('form.search');
    this.formGroup.items.item.inputs.placeholderTranslationKey = this.buildTranslationKey('form.selectItem');
  }
}
