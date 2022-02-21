import { ServiceNotInstalledStatuses, Service } from 'core/modules/data/models/domain';

export function isPluginInstallationFlow(service: Service): boolean {
  return ServiceNotInstalledStatuses.some((v) => v === service?.service_status);
}
