import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworksEventService } from 'core/modules/data/services';
import { IntercomService } from 'core/services';
import { configureTestSuite } from 'ng-bullet';
import { CreateFrameworkModalComponent } from './create-framework-modal.component';

describe('CreateFrameworkModalComponent', () => {
  configureTestSuite();

  let component: CreateFrameworkModalComponent;
  let fixture: ComponentFixture<CreateFrameworkModalComponent>;
  let eventsService: FrameworksEventService;
  let intercom: IntercomService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateFrameworkModalComponent],
      providers: [ { provide: IntercomService, useValue: {}}, { provide: FrameworksEventService, useValue: {}}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFrameworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    eventsService = TestBed.inject(FrameworksEventService);
    eventsService.trackCreateFrameworkCtuClick = jasmine.createSpy('trackCreateFrameworkCtuClick');

    intercom = TestBed.inject(IntercomService);
    intercom.showNewMessage = jasmine.createSpy('showNewMessage');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#contactUs', () => {
    it('should send amplitude event when contact us is called', () => {
      // Act
      component.contactUs();
      
      // Expect
      expect(eventsService.trackCreateFrameworkCtuClick).toHaveBeenCalled();
    });

    it('should open intercom messages', () => {
      // Act
      component.contactUs();
      
      // Expect
      expect(intercom.showNewMessage).toHaveBeenCalled();
    });
  });
});
