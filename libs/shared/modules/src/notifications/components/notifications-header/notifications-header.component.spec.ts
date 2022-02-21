import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonNewComponent } from 'core/modules/buttons/components';
import { ButtonsModule } from 'core/modules/buttons';
import { configureTestSuite } from 'ng-bullet';
import { NotificationsHeaderComponent } from './notifications-header.component';

describe('NotificationsHeaderComponent', () => {
  configureTestSuite();
  let component: NotificationsHeaderComponent;
  let fixture: ComponentFixture<NotificationsHeaderComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsHeaderComponent],
      imports: [TranslateModule.forRoot(), ButtonsModule],
    })
      .overrideComponent(NotificationsHeaderComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clearedAll eventemmiter when pressing the removeall button', () => {
    // Arrange
    spyOn(component.clearAllClicked, 'emit');
    const button = fixture.debugElement.query(By.directive(ButtonNewComponent)).nativeElement;

    // Act
    button.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    // Assert
    expect(component.clearAllClicked.emit).toHaveBeenCalled();
  });

  it('default notificationsCount # should be 0', () => {
    expect(component.notificationsCount).toEqual(0);
  });

  it(`should have 'notifications.panel.' at the prefix of buildTranslationKey`, () => {
    expect(component.buildTranslationKey('')).toEqual('notifications.panel.');
  });
});
