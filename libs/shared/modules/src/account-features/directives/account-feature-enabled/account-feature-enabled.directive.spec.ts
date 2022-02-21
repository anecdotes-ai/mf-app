import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { AccountFeaturesService } from '../../services';
import { AccountFeatureEnabledDirective } from './account-feature-enabled.directive';

@Component({
  template: `<div *isAccountFeatureEnabled="features.AdoptFramework; else disabledTemplate">
      <div id="protected-content-with-disabled-template"></div>
    </div>
    <div *isAccountFeatureEnabled="features.AdoptFramework">
      <div id="protected-content-without-disabled-template"></div>
    </div>
    <ng-template #disabledTemplate>
      <div id="content-for-disabled-feature"></div>
    </ng-template>`,
})
class TestComponent {
  features = AccountFeatureEnum;
}

describe('AccountFeatureEnabledDirective', () => {
  configureTestSuite();
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let accountFeaturesService: AccountFeaturesService;
  let doesAccountHaveFeature: boolean;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [AccountFeatureEnabledDirective, TestComponent],
      providers: [{ provide: AccountFeaturesService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    accountFeaturesService = TestBed.inject(AccountFeaturesService);
    accountFeaturesService.doesAccountHaveFeature = jasmine
      .createSpy('doesAccountHaveFeature')
      .and.callFake(() => of(doesAccountHaveFeature));
  });

  describe('#ngOnInit', () => {
    it('should call accountFeaturesService.doesAccountHaveFeature with passed feature name', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(accountFeaturesService.doesAccountHaveFeature).toHaveBeenCalledWith(AccountFeatureEnum.AdoptFramework);
    });

    it('should show feature content if account has permission to use passed feature', async () => {
      // Arrange
      doesAccountHaveFeature = true;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content-with-disabled-template'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('#content-for-disabled-feature'))).toBeFalsy();
    });

    it('should show disabledTemplate if account does not have permission to use passed feature and disabledTemplate is passed', async () => {
      // Arrange
      doesAccountHaveFeature = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content-with-disabled-template'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('#content-for-disabled-feature'))).toBeTruthy();
    });

    it('should hide feature content if account does not have permission to use passed feature and disabledTemplate is NOT passed', async () => {
      // Arrange
      doesAccountHaveFeature = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.debugElement.query(By.css('#protected-content-without-disabled-template'))).toBeFalsy();
    });
  });
});
