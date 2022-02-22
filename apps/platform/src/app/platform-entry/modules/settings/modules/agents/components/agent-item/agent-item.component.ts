import { AgentGeneralStatuses } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { TextFieldComponent } from 'core/modules/form-controls/components';
import { translationRootKey } from '../../models/constants';
import { agentsIconsPathFactory } from './../../utils/icons-path-factory.function';
import { AgentItemEntity, AgentItemStateEnum } from './../../models/agent-item-entities.models';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
  ViewChild,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-agent-item',
  templateUrl: './agent-item.component.html',
  styleUrls: ['./agent-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentItemComponent implements OnDestroy, OnChanges {
  readonly agentViewItemState = AgentItemStateEnum;
  readonly createAgentFormControl = new FormControl('');
  readonly iconFactory = agentsIconsPathFactory;
  readonly statusMapper = {
    [AgentGeneralStatuses.ONLINE]: {
      icon: 'status_complete',
      class: 'text-blue-50',
      translationKey: this.buildTranslationKey('liveStatus'),
    },
    [AgentGeneralStatuses.OFFLINE]: {
      icon: 'status_error',
      class: 'text-pink-50',
      translationKey: this.buildTranslationKey('errorStatus'),
    },
    [AgentGeneralStatuses.NEVER_DEPLOYED]: {
      icon: 'status_in_progress',
      class: 'text-orange-50',
      translationKey: this.buildTranslationKey('pendingStatus'),
    },
  };

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild(TextFieldComponent)
  newAgentTextField: TextFieldComponent;

  @Input()
  @HostBinding('class.selected')
  selected: boolean;

  @Input()
  saveBtnLoader: boolean;

  @Input()
  agentItem: AgentItemEntity;

  @Output()
  selectedAgentChanged = new EventEmitter<boolean>();

  @Output()
  saveAgent = new EventEmitter<string>();

  constructor(
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('agentItem' in changes) {
      // This is needed in case when agentItem is changed && selected === true, so then we emit this change to update selected object in parent component
      if (this.selected) {
        this.selectedAgentChanged.emit(this.selected);
      }
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.agentItem.${relativeKey}`;
  }
}
