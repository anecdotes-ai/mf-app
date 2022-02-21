import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  HostBinding,
  SimpleChanges,
} from '@angular/core';
import { AnimationOptions, BMEnterFrameEvent } from 'ngx-lottie';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { OnInit, OnChanges } from '@angular/core';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-success-animation',
  templateUrl: './success-animation.component.html',
  styleUrls: ['./success-animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessAnimationComponent implements OnInit, OnChanges {
  private static cache: object;
  private animationItem: AnimationItem;

  options: AnimationOptions = {};

  @HostBinding('style.height')
  @Input()
  height: string;

  @Input()
  activateAnimation: boolean;

  @HostBinding('style.width')
  @Input()
  width: string;

  @Output()
  animationCreated = new EventEmitter();

  private http: HttpClient;

  constructor(httpBackend: HttpBackend, private cd: ChangeDetectorRef, private ngZone: NgZone) {
    this.http = new HttpClient(httpBackend);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ('activateAnimation' in changes) {
      const inputValue = changes['activateAnimation'];
      if (inputValue.currentValue !== inputValue.previousValue && this.animationItem) {
        this.resolveAnimation(inputValue.currentValue);
      }
    }
  }

  resolveAnimation(showAnimation: boolean): void {
    if (showAnimation === true) {
      this.animationItem.goToAndPlay(1, true);
    } else {
      this.animationItem.goToAndStop(36, true);
    }
  }

  ngOnInit(): void {
    this.loadAnimation().then(() => this.cd.detectChanges());
  }

  private async loadAnimation(): Promise<void> {
    if (!SuccessAnimationComponent.cache) {
      SuccessAnimationComponent.cache = await this.http.get('assets/animations/success.json').toPromise();
    }

    this.options = { ...this.options, animationData: SuccessAnimationComponent.cache };
  }

  enterFrame(event: BMEnterFrameEvent): void {
    if (event.currentTime > 36) {
      this.animationItem.pause();
    }
  }

  animationCreatedHandler(animationItem: AnimationItem): void {
    this.animationCreated.emit(animationItem);
    this.animationItem = animationItem;
    this.resolveAnimation(this.activateAnimation);
  }
}
