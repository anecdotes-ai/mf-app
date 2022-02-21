export class OperationError extends Error {
  constructor(public operationId: string, public data: any, public errorCode: number) {
    super(`Operation with id ${operationId} failed due to ${errorCode} error code`);
  }
}
