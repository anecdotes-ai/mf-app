import { ThreadStateEnum } from '@anecdotes/commenting';
import { CommentingResourceModel } from './commenting-resource.model';

export interface ThreadViewModel extends CommentingResourceModel {
  threadId: string;
  threadState?: ThreadStateEnum;
  isCreation?: boolean;
}
