import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntercomService } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { SlackService } from 'core/modules/data/services/slack/slack.service';
import { DataDelegationPageComponent } from './data-delegation-page.component';
import { configureTestSuite } from 'ng-bullet';

describe('DataDelegationPageComponent', () => {
  configureTestSuite();
  
  let component: DataDelegationPageComponent;
  let fixture: ComponentFixture<DataDelegationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataDelegationPageComponent ],
      providers: [ { provide: IntercomService, useValue: {} },
                   { provide: SlackService, useValue: {}}],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDelegationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
