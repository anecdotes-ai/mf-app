import { Injectable } from '@angular/core';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { FilterDefinition, FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { Observable, merge, combineLatest } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { FilterMessageBusMessages } from '../../constants';

@Injectable()
export class DataFilterManagerService {
  constructor(private messageBus: MessageBusService) { }

  isOpen(): Observable<boolean> {
    return merge(this.messageBus.getObservable(FilterMessageBusMessages.FILTER_OPENED).pipe(mapTo(true)), this.messageBus.getObservable(FilterMessageBusMessages.FILTER_CLOSED).pipe(mapTo(false)));
  }

  getFilteringEvent(): Observable<boolean> {
    return this.messageBus.getObservable(FilterMessageBusMessages.FILTER_FILTERING);
  }

  getDataFilterEvent<TData>(): Observable<TData[]> {
    return this.messageBus.getObservable(FilterMessageBusMessages.FILTER_DATA_FILTERED);
  }

  getFilteringOptions(): Observable<{
    [key: string]: { [key: string]: FilterOptionState<any> };
  }> {
    return this.messageBus.getObservable(FilterMessageBusMessages.FILTER_FILTERING_OPTIONS);
  }

  getToggledEvent(): Observable<any> {
    return merge(
      this.messageBus.getObservable(FilterMessageBusMessages.FILTER_OPENED).pipe(mapTo(true)),
      this.messageBus.getObservable(FilterMessageBusMessages.FILTER_CLOSED).pipe(mapTo(false))
    );
  }

  toggleOptions(...options: { fieldId: string; value: any; optionId?: string }[]): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_TOGGLE_OPTIONS, options);
  }

  open(...options: { fieldId: string; value: any }[]): void {
    this.messageBus.sendAsyncMessage(FilterMessageBusMessages.FILTER_OPEN, options);
  }

  setData<TData>(data: TData): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_SET_DATA, data);
  }

  setFilterDefinition<TData>(filterDefinition: FilterDefinition<TData>[]): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_SET_DEFINITION, filterDefinition);
  }

  getFilterDefinition(): Observable<FilterDefinition<any>[]> {
    return this.messageBus.getObservable(FilterMessageBusMessages.FILTER_SET_DEFINITION);
  }

  reset(): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_RESET, null);
  }

  resetField(fieldId: string): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_RESET_FIELD, fieldId);
  }

  refreshFilter(): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_REFRESH, null);
  }

  close(destroyComponent?: boolean): void {
    this.messageBus.sendMessage(FilterMessageBusMessages.FILTER_CLOSE, destroyComponent);
  }
}
