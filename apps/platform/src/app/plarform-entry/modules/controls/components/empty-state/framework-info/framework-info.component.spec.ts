import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrameworkInfoComponent } from './framework-info.component';

describe('FrameworkInfoComponent', () => {
  let component: FrameworkInfoComponent;
  let fixture: ComponentFixture<FrameworkInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FrameworkInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`controls.emptyState.frameworkInfo.${relativeKey}`);
    });
  });

  describe('#getFrameworkIconLink', () => {
    it('should correctly get path to framework icon', () => {
      // Arrange
      const frameworkId = 'someFrameworkId';

      // Act
      const actual = component.getFrameworkIconLink(frameworkId);

      // Assert
      expect(actual).toBe(`frameworks/${frameworkId}`);
    });
  });
});
