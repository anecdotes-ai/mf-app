/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, TemplateRef, ViewChild } from '@angular/core';

import { BaseModalComponent } from './base-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';

@Component({
  selector: 'app-host',
  template: `
    <app-base-modal
      [footerTemplate]="footerTemplate"
      [titleTranslationKey]="titleTranslationKey"
      [descriptionTranslationKey]="descriptionTranslationKey"
      [iconPath]="iconPath"
    >
      <content></content>
    </app-base-modal>

    <ng-template #testFooterTemplate>
      <footer></footer>
    </ng-template>
  `,
})
class HostComponent {
  @ViewChild('testFooterTemplate')
  testFooterTemplate: TemplateRef<any>;

  footerTemplate: TemplateRef<any>;
  titleTranslationKey: string;
  descriptionTranslationKey: string;
  iconPath: string;
}

describe('BaseModalComponent', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let componentUndertest: BaseModalComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, BaseModalComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUndertest = getModalDebugElement().componentInstance;
  });

  function getModalDebugElement(): DebugElement {
    return fixture.debugElement.query(By.directive(BaseModalComponent));
  }

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  describe('header', () => {
    function getHeaderDebugElement(): DebugElement {
      return getModalDebugElement().query(By.css('section.base-modal-header'));
    }

    describe('iconPath', () => {
      function getSvgIconDebugElement(): DebugElement {
        return getHeaderDebugElement()?.query(By.css('svg-icon'));
      }

      it('should render svg icon if iconPath is provided', async () => {
        // Arrange
        hostComponent.iconPath = 'fake-icon-path';

        //
        await detectChanges();

        // Assert
        expect(getSvgIconDebugElement()).toBeTruthy();
      });

      it('should not render render svg icon if iconPath is not provided', async () => {
        // Arrange
        hostComponent.iconPath = undefined;

        //
        await detectChanges();

        // Assert
        expect(getSvgIconDebugElement()).toBeFalsy();
      });
    });

    describe('titleTranslationKey', () => {
      function getTitleDebugElement(): DebugElement {
        return getHeaderDebugElement()?.query(By.css('span.title'));
      }

      it('should render element with class title if titleTranslationKey is provided', async () => {
        // Arrange
        hostComponent.titleTranslationKey = 'fake-translation-key';

        //
        await detectChanges();

        // Assert
        expect(getTitleDebugElement()).toBeTruthy();
      });

      it('should not render element with class title if titleTranslationKey is not provided', async () => {
        // Arrange
        hostComponent.titleTranslationKey = undefined;

        //
        await detectChanges();

        // Assert
        expect(getTitleDebugElement()).toBeFalsy();
      });
    });

    describe('descriptionTranslationKey', () => {
      function getDescriptionDebugElement(): DebugElement {
        return getHeaderDebugElement()?.query(By.css('span.description'));
      }

      it('should render element with class description if descriptionTranslationKey is provided', async () => {
        // Arrange
        hostComponent.descriptionTranslationKey = 'fake-translation-key';

        //
        await detectChanges();

        // Assert
        expect(getDescriptionDebugElement()).toBeTruthy();
      });

      it('should not render element with class description if descriptionTranslationKey is not provided', async () => {
        // Arrange
        hostComponent.descriptionTranslationKey = undefined;

        //
        await detectChanges();

        // Assert
        expect(getDescriptionDebugElement()).toBeFalsy();
      });
    });
  });

  describe('ng-content', () => {
    function getContentDebugElement(): DebugElement {
      return getModalDebugElement().query(By.css('section.base-modal-content'));
    }

    it('should render ng-content', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(getContentDebugElement()?.query(By.css('content'))).toBeTruthy();
    });
  });

  describe('footer', () => {
    function getFooterDebugElement(): DebugElement {
      return getModalDebugElement().query(By.css('section.base-modal-footer'));
    }

    beforeEach(async () => {
      await detectChanges();
    });

    it('should render footer if footerTemplate is provided', async () => {
      // Arrange
      hostComponent.footerTemplate = hostComponent.testFooterTemplate;

      // Act
      await detectChanges();

      // Assert
      expect(getFooterDebugElement()?.query(By.css('footer'))).toBeTruthy();
    });

    it('should not render footer if footerTemplate is not provided', async () => {
      // Arrange
      hostComponent.footerTemplate = undefined;

      // Act
      await detectChanges();

      // Assert
      expect(getFooterDebugElement()?.query(By.css('footer'))).toBeFalsy();
    });
  });
});
