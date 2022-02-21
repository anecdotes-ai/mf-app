import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

declare type MessageKey = string | number;

@Injectable()
export class MessageBusService {
  private subject = new EventEmitter<{ key: MessageKey; payload: any }>(true);

  getObservable<TMessage>(key: MessageKey, partitionKey?: MessageKey): Observable<TMessage> {
    const resolvedKey = this.resolveFullMessageKey(key, partitionKey);
    return this.subject.pipe(
      filter((t) => t.key === resolvedKey),
      map((t) => t.payload as TMessage)
    );
  }

  getFeedByKeyPrefix<TMessage>(partialKey: MessageKey): Observable<{ key: MessageKey; payload: TMessage }> {
    return this.subject.pipe(filter((t) => t.key.toString().startsWith(partialKey.toString())));
  }

  sendMessage<TMessage>(key: MessageKey, data: TMessage, partitionKey?: MessageKey): void {
    this.subject.next({ key: this.resolveFullMessageKey(key, partitionKey), payload: data });
  }

  sendAsyncMessage<TMessage>(key: MessageKey, data: TMessage, isAsync?: boolean, partitionKey?: MessageKey): void {
    setTimeout(() => {
      this.subject.next({ key: this.resolveFullMessageKey(key, partitionKey), payload: data });
    }, 0);
  }

  private resolveFullMessageKey(key: MessageKey, partitionKey: MessageKey): MessageKey {
    return partitionKey ? `${partitionKey}_${key}` : key;
  }
}
