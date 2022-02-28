import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable } from 'rxjs';
import { SendSlackMessage, SlackChannel, SlackUser } from '../../models/slack';
import { AbstractService } from '../abstract-http/abstract-service';

@Injectable()
export class SlackService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getUsers(): Observable<SlackUser[]> {
    return this.http.get<SlackUser[]>(this.builSlackdUrl((a) => a.users));
  }

  getChannels(): Observable<SlackChannel[]> {
    return this.http.get<SlackChannel[]>(this.builSlackdUrl((a) => a.channels));
  }

  dissmissSlackPendingState(control_requirement_id: string): Observable<any> {
    return this.http.delete<any>(this.builSlackdUrl((a) => a.dissmissSlackPendingState, { control_requirement_id }));
  }

  sendSlackMessage(message: string, recipients: string[], control_requirement_id: string): Observable<any> {
    const messagePostData: SendSlackMessage = {
      message,
      recipients,
    };

    return this.http.post<any>(
      this.builSlackdUrl((a) => a.sendSlackMessage, { control_requirement_id }),
      messagePostData
    );
  }
}
