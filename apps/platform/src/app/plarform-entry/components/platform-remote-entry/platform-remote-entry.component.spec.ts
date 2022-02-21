import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { AmplitudeService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  configureTestSuite();

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  let amplitudeServiceMock: AmplitudeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot(),
          ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        ],
        declarations: [AppComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{ provide: AmplitudeService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    amplitudeServiceMock = TestBed.inject(AmplitudeService);
    amplitudeServiceMock.init = jasmine.createSpy('init');
  });

  it('should create the app', () => {
    // Assert
    expect(app).toBeTruthy();
  });

  it('should call init function from amplitude service', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(amplitudeServiceMock.init).toHaveBeenCalled();
  });
});
