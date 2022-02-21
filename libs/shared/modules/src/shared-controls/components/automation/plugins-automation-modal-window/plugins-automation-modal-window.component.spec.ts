// import { configureTestSuite } from 'ng-bullet';
// import { ControlRequirement } from 'core/modules/data/models/domain';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
// import { PluginsAutomationModalWindowComponent } from './plugins-automation-modal-window.component';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { Component, Input } from '@angular/core';
// import { By } from '@angular/platform-browser';

// @Component({
//   selector: 'app-big-plugin-item',
//   template: '',
// })
// export class BigPluginItemMockComponent {
//   @Input()
//   pluginData;
// }

// @Component({
//   selector: 'app-base-modal',
//   template: '<ng-content></ng-content>',
// })
// export class BaseModalMockComponent {
//   @Input()
//   leftCornerData;
//   @Input()
//   iconPath;
//   @Input()
//   titleTranslationKey;
//   @Input()
//   descriptionTranslationKey;
// }

// describe('PluginsAutomationModalWindowComponent', () => {
//   configureTestSuite();
//   let component: PluginsAutomationModalWindowComponent;
//   let fixture: ComponentFixture<PluginsAutomationModalWindowComponent>;
//   let requirement: ControlRequirement;

//   beforeAll(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [PluginsAutomationModalWindowComponent, BigPluginItemMockComponent, BaseModalMockComponent],
//       imports: [PerfectScrollbarModule],
//       providers: [ComponentSwitcherDirective],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     requirement = {
//       requirement_name: 'Test name',
//     };
//     fixture = TestBed.createComponent(PluginsAutomationModalWindowComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('buildTranslationKey', () => {
//     it('should return correct ', () => {
//       // Arrange
//       const relativeKey = 'fakeKey';

//       // Act
//       const actualBuiltKey = component.buildTranslationKey(relativeKey);

//       // Assert
//       expect(actualBuiltKey).toBe(`automatePluginsModal.${relativeKey}`);
//     });
//   });

//   describe('relatedPlugins provider', () => {

//     it('should render big plugins', async () => {
//       // Arrange
//       const expectedServices = [{}, {}, {}];
//       component.relatedPlugins = expectedServices;
//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       const bigPluginComponents = fixture.debugElement
//         .queryAll(By.directive(BigPluginItemMockComponent))
//         .map((x) => x.componentInstance as BigPluginItemMockComponent);

//       // Assert
//       expect(bigPluginComponents.length).toBe(expectedServices.length);
//       bigPluginComponents.forEach((bigPluginComponent, index) => {
//         expect(bigPluginComponent.pluginData).toBe(expectedServices[index]);
//       });
//     });
//   });

//   describe('base modal', () => {
//     beforeEach(() => {
//       component.baseModalConfigData = {
//         titleKey: 'fakeTitle',
//         descriptionKey: 'fakeDescription',
//       };
//     });

//     function getBaseModalComponent(): BaseModalMockComponent {
//       return fixture.debugElement.query(By.directive(BaseModalMockComponent))?.componentInstance;
//     }

//     it('should be rendered', () => {
//       // Arrange
//       // Act
//       fixture.detectChanges();

//       // Assert
//       expect(getBaseModalComponent()).toBeTruthy();
//     });

//     it('should be provided with left corner data based on requirement', () => {
//       // Arrange
//       component.cornerTitle = 'fakeName';

//       // Act
//       fixture.detectChanges();

//       // Assert
//       expect(getBaseModalComponent().leftCornerData).toEqual({
//         icon: 'info',
//         titleText: component.cornerTitle
//       });
//     });

//     it('should be provided with icon name', () => {
//       // Arrange
//       component.iconName = 'fakeIcon';

//       // Act
//       fixture.detectChanges();

//       // Assert
//       expect(getBaseModalComponent().iconPath).toBe(component.iconName);
//     });

//     it('should be provided with titleTranslationKey from baseModalConfigData', () => {
//       // Arrange
//       // Act\
//       fixture.detectChanges();

//       // Assert
//       expect(getBaseModalComponent().titleTranslationKey).toBe(component.baseModalConfigData.titleKey);
//     });

//     it('should be provided with descriptionTranslationKey from baseModalConfigData', () => {
//       // Arrange
//       // Act
//       fixture.detectChanges();

//       // Assert
//       expect(getBaseModalComponent().descriptionTranslationKey).toBe(component.baseModalConfigData.descriptionKey);
//     });
//   });
// });
