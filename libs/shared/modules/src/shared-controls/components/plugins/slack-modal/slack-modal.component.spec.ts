import { SlackService, OperationsTrackerService } from 'core/modules/data/services';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlackModalComponent } from './slack-modal.component';
import { LoaderManagerService, MessageBusService } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { TranslateModule } from '@ngx-translate/core';
import { HttpBackend, HttpClient, HttpHandler } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'core/modules/data/store';
import { RouterTestingModule } from '@angular/router/testing';
import { RequirementsFacadeService } from 'core/modules/data/services';

describe('SlackModalComponent', () => {
  let component: SlackModalComponent;
  let fixture: ComponentFixture<SlackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlackModalComponent],
      imports: [TranslateModule.forRoot(), StoreModule.forRoot(reducers), RouterTestingModule],
      providers: [
        provideMockStore(),
        { provide: ModalWindowService, useValue: {} },
        { provide: LoaderManagerService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
        SlackService,
        HttpClient,
        HttpHandler,
        HttpBackend,
        OperationsTrackerService,
        MessageBusService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlackModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
