import { SnapshotEndpoints } from 'core';

export const snapshotEndpoints: SnapshotEndpoints = {
  getEntitySnapshot: '/snapshot/{{resource_type}}/{{resource_id}}?snapshot_id={{snapshot_id}}',
  getMultipleSnapshot: '/snapshot/get',
};
