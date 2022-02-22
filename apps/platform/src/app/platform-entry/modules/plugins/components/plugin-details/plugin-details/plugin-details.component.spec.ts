import { PluginFacadeService } from 'core/modules/data/services/facades';
import { configureTestSuite } from 'ng-bullet';
import { PluginConnectionFacadeService } from 'core/modules/plugins-connection/services/facades/plugin-connection-facade/plugin-connection-facade.service';
import { PluginNotificationSenderService } from 'core/services/plugin-notification-sender/plugin-notification-sender.service';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PluginNavigationService } from 'core/services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { PluginDetailsComponent } from './plugin-details.component';

const fakeActivatedRoute = {
  snapshot: { data: {} },
} as ActivatedRoute;

describe('PluginDetailsComponent', () => {
  configureTestSuite();
  let component: PluginDetailsComponent;
  let fixture: ComponentFixture<PluginDetailsComponent>;

  beforeAll((() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [PluginDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: PluginNotificationSenderService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        {
          provide: PluginNavigationService,
          useValue: {
            redirectToEvidence: jasmine.createSpy('redirectToEvidence'),
          },
        },
        {
          provide: PluginFacadeService,
          useValue: {
          }
        },
        {
          provide: PluginConnectionFacadeService,
          useValue: {}
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
