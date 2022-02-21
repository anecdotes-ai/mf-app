import { RouteParams } from 'core/constants/routes';
import { Injectable } from '@angular/core';
import * as jsonPatch from 'fast-json-patch';
import { Router } from '@angular/router';
import { placeholderFile } from 'core/modules/plugins-connection/utils/placeholder-file';

@Injectable({
  providedIn: 'root',
})
export class PluginsDataService {
  constructor(private router: Router) { }

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

  async showServiceInstanceLogs(serviceInstanceId: string): Promise<boolean> {
    return await this.router.navigate([], {
      queryParams: {
        tab: RouteParams.plugin.logsQueryParamValue,
        [RouteParams.plugin.logsForServiceId]: serviceInstanceId
      },
    });
  }
}
