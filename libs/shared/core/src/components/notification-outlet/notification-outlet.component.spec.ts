import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationOutletComponent } from './notification-outlet.component';
import { PluginService } from 'core/modules/data/services';
import { HttpBackend, HttpClient, HttpHandler } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { reducers, RemoveNotificationAction } from 'core/modules/data/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('NotificationOutletComponent', () => {
  let component: NotificationOutletComponent;
  let fixture: ComponentFixture<NotificationOutletComponent>;
  let mockStore: MockStore;
  let mockStoreDispatchSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationOutletComponent],
      imports: [StoreModule.forRoot(reducers)],
      providers: [PluginService, HttpClient, HttpHandler, HttpBackend, provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    // Arrange
    fixture = TestBed.createComponent(NotificationOutletComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockStore.setState({ notificationsState: {} });
    mockStoreDispatchSpy = spyOn(mockStore, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test: trackByFn', () => {
    it('should return object key if object exist', () => {
      // Arrange
      const mockIndex = 10;
      const mockObj = {
        key: 'some value',
      };
      const result = component.trackByFn(mockIndex, mockObj);

      // Assert
      expect(result).toEqual(mockObj.key);
    });
    it('should return index if object does not exist', () => {
      // Arrange
      const mockIndex = 10;
      const mockObj = null;
      const result = component.trackByFn(mockIndex, mockObj);

      // Assert
      expect(result).toEqual(mockIndex);
    });
  });

  describe('Test: comparisonFn', () => {
    it('should return 1', async () => {
      // Act
      const result = component.comparisonFn();

      // Assert
      expect(result).toEqual(1);
    });
  });

  describe('Test: closing', () => {
    it('should call dispatch RemoveNotificationAction', async () => {
      // Arrange
      const notificationId = 'someId';

      // Act
      component.closing(notificationId);

      // Assert
      expect(mockStore.dispatch).toHaveBeenCalledWith(new RemoveNotificationAction(notificationId));
    });
  });
});
