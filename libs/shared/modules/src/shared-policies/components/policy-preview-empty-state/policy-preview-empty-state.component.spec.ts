import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PolicyPreviewEmptyStateComponent } from './policy-preview-empty-state.component';

describe('PolicyPreviewEmptyStateComponent', () => {
  let component: PolicyPreviewEmptyStateComponent;
  let fixture: ComponentFixture<PolicyPreviewEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyPreviewEmptyStateComponent ],
      imports:[TranslateModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyPreviewEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`policyManager.policy.emptyPreview.${relativeKey}`);
    });
  });

  describe('onLinkClick', () => {
    it('should emit linkClick', () => {
      // Arrange
      spyOn(component.linkClick, 'emit');

      // Act
      component.onLinkClick();

      // Assert
      expect(component.linkClick.emit).toHaveBeenCalled();
    });
  });


});
