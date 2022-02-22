import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IntercomService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { ExclusiveFrameworkAdoptionComponent } from './exclusive-framework-adoption.component';

describe('ExclusiveFrameworkAdoptionComponent', () => {
  configureTestSuite();

  let component: ExclusiveFrameworkAdoptionComponent;
  let fixture: ComponentFixture<ExclusiveFrameworkAdoptionComponent>;
  let intercomService: IntercomService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ExclusiveFrameworkAdoptionComponent],
      providers: [{ provide: IntercomService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveFrameworkAdoptionComponent);
    component = fixture.componentInstance;

    intercomService = TestBed.inject(IntercomService);
    intercomService.showNewMessage = jasmine.createSpy('showNewMessage');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#contactUs', () => {
    it('should call intercomService.showNewMessage', () => {
      // Act
      component.contactUs();

      // Assert
      expect(intercomService.showNewMessage).toHaveBeenCalled();
    });
  });

  describe('#buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`controls.emptyState.${relativeKey}`);
    });
  });
});
