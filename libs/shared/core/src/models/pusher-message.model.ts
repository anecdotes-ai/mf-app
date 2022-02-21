import { PusherMessageType } from './pusher-message-type.model';

export interface PusherMessage<TMessageObject = any> {
  message_type: PusherMessageType;
  message?: string;
  message_object: TMessageObject;
}
