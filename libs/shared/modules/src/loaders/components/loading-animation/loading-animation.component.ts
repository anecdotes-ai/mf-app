import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-animation',
  templateUrl: './loading-animation.component.html',
  styleUrls: ['./loading-animation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingAnimationComponent implements OnInit {
  private static cache: object;

  options: AnimationOptions = {};

  @Input()
  height: string;

  @Input()
  width: string;

  @Output()
  animationCreated = new EventEmitter();

  private http: HttpClient;

  constructor(httpBackend: HttpBackend, private cd: ChangeDetectorRef) {
    this.http = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
    this.loadAnimation().then(() => this.cd.detectChanges());
  }

  private async loadAnimation(): Promise<void> {
    if (!LoadingAnimationComponent.cache) {
      LoadingAnimationComponent.cache = await this.http.get('assets/animations/loader.json').toPromise();
    }

    this.options = { ...this.options, animationData: LoadingAnimationComponent.cache };
  }
}
