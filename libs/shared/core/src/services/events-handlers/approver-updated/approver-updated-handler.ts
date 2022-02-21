import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApproverData, ApproverRoleEnum } from 'core/models';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { PusherMessage } from 'core/models/pusher-message.model';
import { ApproverInstance, PolicySettings } from 'core/modules/data/models/domain';
import { PolicyUpdatedAction } from 'core/modules/data/store/actions';
import { State } from 'core/modules/data/store/state';
import { take } from 'rxjs/operators';
import { EventHandler } from '../event-handler.interface';

type SettingsKeys = keyof PolicySettings;

@Injectable()
export class ApproverUpdatedHandler implements EventHandler<PusherMessage> {
  readonly messageType = PusherMessageType.ApproverUpdated;
  
  constructor(private store: Store<State>) { }
  
  async handle(message: PusherMessage<ApproverData>): Promise<void> {
    if (!message.message_object.policy_id || !message.message_object.approver) {
      return;
    }

    const approverData = message.message_object;
    const currentPolicy = await this.store
      .select((s) => s.policyState.policies.entities[approverData.policy_id])
      .pipe(take(1))
      .toPromise();
    const updatedSettings = this.updateApprover(currentPolicy.policy_settings, approverData.approver);

    if (!updatedSettings) {
      return;
    }

    const updatedPolicy = { policy_id: approverData.policy_id, policy_settings: updatedSettings };
    this.store.dispatch(new PolicyUpdatedAction(updatedPolicy.policy_id, updatedPolicy));
  }

  private updateApprover(policySettings: PolicySettings, updatedApprover: ApproverInstance): PolicySettings {
    let settingsChanged;
    if (policySettings.owner?.email === updatedApprover.email) {
      policySettings.owner = { ...policySettings.owner, ...updatedApprover };
      settingsChanged = true;
    } 
    const settingsKeysArr: SettingsKeys[] = ['reviewers', 'approvers'];
    settingsKeysArr.forEach(propName => {
      const currApproversArray: Array<ApproverInstance> = policySettings[propName] as Array<ApproverInstance>;
      const approvedIndx = currApproversArray ? currApproversArray.findIndex((a) => a.email === updatedApprover.email) : -1;
      if (approvedIndx >= 0) {
        currApproversArray[approvedIndx] = { ...currApproversArray[approvedIndx], ...updatedApprover };
        settingsChanged = true;
      }
    }); 

    return settingsChanged? policySettings : undefined;
  }
}
