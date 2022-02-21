import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { isNumber } from 'core/utils';

interface LogExtended {
  visible?: boolean;
  message?: string;
  severity?: SeverityEnum | string;
  timestamp?: Date | number;
}

export enum SeverityEnum {
  INFO = "INFO",
  DEBUG = "DEBUG",
  ERROR = "ERROR",
  WARNING = "WARNING",
}

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogItemComponent implements AfterViewInit {
  @ViewChild('wrapperText')
  private wrapperText: ElementRef<HTMLSpanElement>;

  @ViewChild('wrapper')
  private wrapper: ElementRef<HTMLDivElement>;

  logMessageToDisplay: string;

  @Input()
  log: LogExtended;

  @Input()
  logSeverities: any = SeverityEnum;

  allowLogToDisplay: boolean;

  constructor(private cd: ChangeDetectorRef) { }

  getDateTimeOfLog(): Date {
    if (isNumber(this.log.timestamp)) {
      return this.convertTimestampToDate(this.log.timestamp);
    }
    return this.log.timestamp;
  }

  ngAfterViewInit(): void {
    this.allowLogToDisplay = this.log.message && this.wrapperText && this.checkOffsetHeight(this.wrapper.nativeElement);
    this.cd.detectChanges();
  }

  checkOffsetHeight(wrapper: HTMLElement): boolean {
    return wrapper.scrollHeight > wrapper.clientHeight;
  }

  private convertTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  showMore(): void {
    this.log.visible = !this.log.visible;
  }
}
