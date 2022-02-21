import { InjectionToken } from '@angular/core';
import { EventHandler } from './event-handler.interface';

export const eventHandlerToken = new InjectionToken<EventHandler<any>>('event-handler');
