import { configureTestSuite } from 'ng-bullet';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MetadataViewComponent } from './metadata-view.component';
import { TranslateModule } from '@ngx-translate/core';

describe('MetadataViewComponent', () => {
  configureTestSuite();
  let component: MetadataViewComponent;
  let fixture: ComponentFixture<MetadataViewComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MetadataViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('metadata-description html element', () => {
    it('metadata-description span element should be displayed when metadataDescriptionTranslationKey provided', () => {
      // Arrange
      component.metadataDescriptionTranslationKey = 'someTranslationKey';

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('.metadata-description'))).toBeTruthy();
    });

    it('metadata-description span element should not be displayed when metadataDescriptionTranslationKey is not provided', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('.metadata-description'))).toBeFalsy();
    });
  });
});
