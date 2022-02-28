import { RouteParams } from 'core/constants/routes';
import { Injectable } from '@angular/core';
import * as jsonPatch from 'fast-json-patch';
import { Router } from '@angular/router';
import { placeholderFile } from 'core/modules/plugins-connection/utils/placeholder-file';
import { MultiAccountsEventService } from 'core/modules/data/services/event-tracking/multi-accounts-event-service/multi-accounts-event.service';
import { UserEvents } from 'core/models/user-events/user-event-data.model';

@Injectable()
export class PluginsDataService {
  constructor(private router: Router, private multiAccountsEventService: MultiAccountsEventService) { }

  resolveReconnectOperations(
    allPreviousValues: { [key: string]: any },
    allCurrentValues: { [key: string]: any }
  ): jsonPatch.Operation[] {
    const allPreviousValuesToResolve = allPreviousValues ?? {};

    Object.keys(allCurrentValues).forEach((key) => {
      if (allCurrentValues[key] instanceof File && allCurrentValues[key].type === placeholderFile) {
        allCurrentValues[key] = allPreviousValues[key];
      }

      if (allCurrentValues[key] instanceof File && allPreviousValuesToResolve[key]) {
        // This trick allows to make appropriate 'replace' operation for File
        allPreviousValuesToResolve[key] = null;
        return;
      }

      // Delete all other (not Files related) properties that are not assigned, to create expected 'add' operation
      if (!allPreviousValuesToResolve[key]) {
        delete allPreviousValuesToResolve[key];
      }
    });

    let operations = jsonPatch.compare(allPreviousValuesToResolve, allCurrentValues) as any;

    // Adding File object to operation value.
    operations.forEach((op) => {
      const propName = op.path.substring(1);
      if (allCurrentValues[propName] instanceof File) {
        op.value = allCurrentValues[propName];
      }
    });

    return operations;
  }

  async showServiceInstanceLogs(serviceInstanceId: string, service_id: string): Promise<boolean> {
    this.multiAccountsEventService.trackMultiAccountWithPluginName(UserEvents.VIEW_ACCOUNT_LOGS, service_id);
    return await this.router.navigate([], {
      queryParams: {
        tab: RouteParams.plugin.logsQueryParamValue,
        [RouteParams.plugin.logsForServiceId]: serviceInstanceId
      },
    });
  }
}
