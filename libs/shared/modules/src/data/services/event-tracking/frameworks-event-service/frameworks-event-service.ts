import {FrameworkEventDataPropertyNames, FrameworkEventData, ExploreControlsSource, UserEvents} from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Injectable } from '@angular/core';
import { SocTypes } from 'core/modules/shared-framework/constants';

@Injectable()
export class FrameworksEventService {
  constructor(private userEventService: UserEventService) {}

  trackRemoveFrameworkClick(framework_name: string): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_REMOVE, {
      [FrameworkEventDataPropertyNames.FrameworkName]: framework_name,
    });
  }

  trackAddFrameworkClick(framework_name: string): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_ADD, {
      [FrameworkEventDataPropertyNames.FrameworkName]: framework_name,
    });
  }

  trackFrameworkOverviewClick(framework_name: string, source: string): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_OVERVIEW, {
      [FrameworkEventDataPropertyNames.FrameworkName]: framework_name,
      [FrameworkEventDataPropertyNames.OverviewSource]: source,
    });
  }

  trackExploreControlsClick(framework_name: string, source: ExploreControlsSource): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_EXPLORE_CONTROLS, {
      [FrameworkEventDataPropertyNames.FrameworkName]: framework_name,
      [FrameworkEventDataPropertyNames.Source]: source,
    });
  }

  trackSetupFrameworkAuditClick(
    framework_name: string,
    audit_date: Date,
    socType?: SocTypes,
    audit_range?: Date[]
  ): void {
    const eventData = this.getAuditInfoEventData(framework_name, audit_date, socType, audit_range);

    this.userEventService.sendEvent(UserEvents.FRAMEWORK_SETUP_AUDIT, eventData);
  }

  trackEditFrameworkAuditClick(
    framework_name: string,
    audit_date: Date,
    socType?: SocTypes,
    audit_range?: Date[]
  ): void {
    const eventData = this.getAuditInfoEventData(framework_name, audit_date, socType, audit_range);
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_EDIT_AUDIT, eventData);
  }

  trackResetFrameworkAuditClick(framework_name: string, audit_date: Date): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_RESET_AUDIT, {
      [FrameworkEventDataPropertyNames.FrameworkName]: framework_name,
      [FrameworkEventDataPropertyNames.AuditDate]: this.formatDate(audit_date),
    });
  }

  /**
   * Tracking user click on create framework button
   */
  trackCreateFrameworkClick(): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_CREATE);
  }

  /**
   * Tracking user click on contact us in the create framework modal
   */
  trackCreateFrameworkCtuClick(): void {
    this.userEventService.sendEvent(UserEvents.FRAMEWORK_CREATE_CTU);
  }

  trackEndFrameworkAuditClick(framework_name: string, audit_date: Date, socType?: SocTypes): void {
    const eventData = this.getAuditInfoEventData(framework_name, audit_date, socType);

    this.userEventService.sendEvent(UserEvents.FRAMEWORK_END_AUDIT, eventData);
  }

  private getAuditInfoEventData(
    framework_name: string,
    audit_date: Date,
    socType?: SocTypes,
    audit_range?: Date[]
  ): FrameworkEventData {
    return {
      [FrameworkEventDataPropertyNames.FrameworkName]: framework_name,
      [FrameworkEventDataPropertyNames.AuditDate]: this.formatDate(audit_date),
      ...(socType ? { [FrameworkEventDataPropertyNames.SocType]: socType } : {}),
      ...(audit_range ? { [FrameworkEventDataPropertyNames.AuditRange]: audit_range.map(date => this.formatDate(date)) } : {}),
    };
  }

  private formatDate(date: Date): string {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
  }
}
