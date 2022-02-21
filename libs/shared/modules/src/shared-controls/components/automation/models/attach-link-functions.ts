import { CollectionResult } from 'core/models/collection-result.model';
import { PusherMessage } from 'core/models/pusher-message.model';

export interface AttachLinkFunctions {
  wasEvidenceAddedToResource?: () => Promise<boolean>;
  filterCollectionResult?: (msg: PusherMessage<CollectionResult>) => boolean;
}
