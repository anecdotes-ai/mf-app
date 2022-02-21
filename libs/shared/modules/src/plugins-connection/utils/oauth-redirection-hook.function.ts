import { Service } from 'core/modules/data/models/domain';
import { Params } from '@angular/router';
import { RouteParams } from 'core/constants/routes';

export function isInstallPluginRedirection(service: Service, params: Params): boolean {
  // Small hotfix with OAuth plugins
  // remove unexpected params that are not indication of connection process
  const filteredParams = getInstallationRequestQueryParams(params);
  if (!Object.keys(filteredParams)?.length) {
    return false;
  }

  const paramsNames = Object.getOwnPropertyNames(params);
  return !!paramsNames.length && !paramsNames.includes('error') && !!service;
}

export function getInstallationRequestQueryParams(params: Params): Params {
  const copiedParams = {...params};

  Object.keys(copiedParams).forEach((key) => {
    if(Object.values(RouteParams.plugin).includes(key)) {
      delete copiedParams[key];
    }
  });

  return copiedParams;
}
