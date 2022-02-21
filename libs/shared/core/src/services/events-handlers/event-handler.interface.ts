export interface EventHandler<TMessage> {
  readonly messageType: string;
  handle(message: TMessage): void | Promise<void>;
}
