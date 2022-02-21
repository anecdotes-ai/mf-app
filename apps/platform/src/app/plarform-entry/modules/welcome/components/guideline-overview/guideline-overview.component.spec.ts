import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidelineOverviewComponent } from './guideline-overview.component';

describe('GuidelineOverviewComponent', () => {
  let component: GuidelineOverviewComponent;
  let fixture: ComponentFixture<GuidelineOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuidelineOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidelineOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('image-container', () => {
    it('should be displayed when index is number', () => {
      // Arrange
      component.index = 1;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const imageContainer = guidelineOverviewElement.querySelector('.image-container');

      // Assert
      expect(imageContainer).toBeTruthy();
    });

    it('should not be displayed when index is undefined', () => {
      // Arrange
      component.index = undefined;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const imageContainer = guidelineOverviewElement.querySelector('.image-container');

      // Assert
      expect(imageContainer).toBeFalsy();
    });
  });

  describe('index-icon', () => {
    it('should apply index-icon-coming-soon css class when comingSoon is true', () => {
      // Arrange
      component.index = 1;
      component.comingSoon = true;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const inedxIcon = guidelineOverviewElement.querySelector('.index-icon');

      // Assert
      expect(inedxIcon.className).toContain('index-icon-coming-soon');
    });

    it('should not apply index-icon-coming-soon css class when comingSoon is false', () => {
      // Arrange
      component.index = 1;
      component.comingSoon = false;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const imageContainer = guidelineOverviewElement.querySelector('.image-container');

      // Assert
      expect(imageContainer).not.toContain('index-icon-coming-soon');
    });
  });

  describe('index span', () => {
    it('should display index input parameter value', () => {
      // Arrange
      component.index = 100;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const inedxSpan = guidelineOverviewElement.querySelector('.index');

      // Assert
      expect(inedxSpan.textContent).toEqual(component.index.toString());
    });
  });

  describe('inline div', () => {
    it('should apply coming-soon css class when comingSoon is true', () => {
      // Arrange
      component.comingSoon = true;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const inlineDiv = guidelineOverviewElement.getElementsByClassName('title-text')[0];

      // Assert
      expect(inlineDiv.className).toContain('coming-soon');
    });

    it('should not apply coming-soon css class when comingSoon is false', () => {
      // Arrange
      component.comingSoon = false;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const inlineDiv = guidelineOverviewElement.getElementsByClassName('title-text')[0];

      // Assert
      expect(inlineDiv.className).not.toContain('coming-soon');
    });
  });

  describe('description paragraph', () => {
    it('should apply coming-soon css class when comingSoon is true', () => {
      // Arrange
      component.comingSoon = true;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const descriptionP = guidelineOverviewElement.querySelector('.description');

      // Assert
      expect(descriptionP.className).toContain('coming-soon');
    });

    it('should not apply coming-soon css class when comingSoon is false', () => {
      // Arrange
      component.comingSoon = false;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const descriptionP = guidelineOverviewElement.querySelector('.description');

      // Assert
      expect(descriptionP.className).not.toContain('coming-soon');
    });
  });

  describe('coming-soon-icon', () => {
    it('should be displayed when comingSoon is true', () => {
      // Arrange
      component.comingSoon = true;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const comingSoonIcon = guidelineOverviewElement.querySelector('.coming-soon-icon');

      // Assert
      expect(comingSoonIcon).toBeTruthy();
    });

    it('should not be displayed when comingSoon is false', () => {
      // Arrange
      component.comingSoon = false;

      // Act
      fixture.detectChanges();
      const guidelineOverviewElement: HTMLElement = fixture.nativeElement;
      const comingSoonIcon = guidelineOverviewElement.querySelector('.coming-soon-icon');

      // Assert
      expect(comingSoonIcon).toBeFalsy();
    });
  });
});
