// import { Subject } from 'rxjs';
// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { DataFilterOutletComponent } from './data-filter-outlet.component';
// import { FilterMessageBusMessages, MessageBusService } from '../../services';
// import { RouterTestingModule } from '@angular/router/testing';
// import { filter, map } from 'rxjs/operators';
// import { FilterDefinition } from 'core/models';
// import { Router, Params, NavigationExtras } from '@angular/router';
// import { Component } from '@angular/core';
// import { By } from '@angular/platform-browser';

// @Component({
//   selector: 'app-data-filter',
//   template: '<p>Mock data filter</p>',
// })
// class MockDataFilterComponent {
//   toggleOptions(...options: { fieldId: string; value: any }[]): void {}
//   reset(): void {}
//   initialize(): void {}
//   expandComponent(...options: { fieldId: string; value: any }[]): void {}
//   collapseComponent(): void {}
// }

// class MockRouter {
//   routerState: {
//     root: {
//       snapshot: {
//         queryParams: Params;
//       };
//     };
//   };

//   navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
//     return Promise.resolve(true);
//   }

//   constructor() {
//     this.routerState = { root: { snapshot: { queryParams: {} } } };
//   }
// }

// describe('DataFilterOutletComponent', () => {
//   let component: DataFilterOutletComponent;
//   let fixture: ComponentFixture<DataFilterOutletComponent>;
//   let dataFilterChildComponent: MockDataFilterComponent;

//   let messageBusService: MessageBusService;
//   let router: MockRouter;

//   let eventSubject: Subject<{ eventName: string; eventBody: any }>;

//   let getObservableSpy: jasmine.Spy<jasmine.Func>;
//   let sendMessageSpy: jasmine.Spy<jasmine.Func>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule],
//       declarations: [DataFilterOutletComponent, MockDataFilterComponent],
//       providers: [
//         { provide: MessageBusService, useValue: {} },
//         { provide: Router, useClass: MockRouter },
//       ],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DataFilterOutletComponent);
//     component = fixture.componentInstance;

//     component.filterContext = {
//       data: [{ randomTestData: 'value' }, { randomTestData: 'value2' }],
//       filterDefinition: [{ fieldId: 'firstField' }, { fieldId: 'secondField' }],
//     };

//     messageBusService = TestBed.inject(MessageBusService);
//     router = TestBed.inject(Router);

//     eventSubject = new Subject<any>();
//     messageBusService.getObservable = getObservableSpy = jasmine
//       .createSpy('getObservable')
//       .and.callFake((eventName: string) =>
//         eventSubject.pipe(
//           filter((val) => val.eventName === eventName),
//           map((data) => data.eventBody)
//         )
//       );
//     messageBusService.sendMessage = sendMessageSpy = jasmine
//       .createSpy('sendMessage')
//       .and.callFake((eventName: string, eventBody: any) => eventSubject.next({ eventName, eventBody }));
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('#ngOnInit', () => {
//     it('subscribe for FILTER_OPEN event should execute when exact message sent', async () => {
//       // Arrange
//       const fakeDataToSend = [{ fieldId: 'fakeFieldId', value: 'fakeValue' }];

//       component.filterContext = {
//         data: [{}],
//         filterDefinition: [{}] as any,
//       };
//       fixture.detectChanges();
//       await fixture.whenStable();

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;

//       dataFilterChildComponent.expandComponent = jasmine.createSpy('dataFilterChildComponent.expandComponent');

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_OPEN, fakeDataToSend);

//       // Assert
//       expect(dataFilterChildComponent.expandComponent).toHaveBeenCalledWith(...fakeDataToSend);
//     });

//     it('when FILTER_CLOSE event with "true", should reset filter context', async () => {
//       // Arrange
//       fixture.detectChanges();
//       await fixture.whenStable();
//       expect(component.filterContext).not.toBe(null);

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;

//       dataFilterChildComponent.collapseComponent = jasmine.createSpy('dataFilterChildComponent.collapseComponent');

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_CLOSE, true);

//       // Assert
//       expect(component.filterContext).toBe(null);
//       expect(dataFilterChildComponent.collapseComponent).not.toHaveBeenCalled();
//     });

//     it('when FILTER_CLOSE event with "false", should collapse datafilter component', async () => {
//       // Arrange
//       fixture.detectChanges();
//       await fixture.whenStable();
//       expect(component.filterContext).not.toBe(null);
//       const expectedFilterContext = { ...component.filterContext };

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;

//       dataFilterChildComponent.collapseComponent = jasmine.createSpy('dataFilterChildComponent.collapseComponent');

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_CLOSE, false);

//       // Assert
//       expect(expectedFilterContext).toEqual(component.filterContext);
//       expect(dataFilterChildComponent.collapseComponent).toHaveBeenCalled();
//     });

//     it('when FILTER_SET_DATA event with data, should set new, passed data, to filterContext', async () => {
//       // Arrange
//       fixture.componentInstance.ngOnInit();
//       await fixture.whenStable();
//       expect(component.filterContext).not.toBe(null);
//       const expectedInitialFilterContext = { ...component.filterContext };
//       const dataToUpsert = [{ randomTestData: 'testValue to upsert' }];

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_SET_DATA, dataToUpsert);

//       // Assert
//       expect(component.filterContext).toEqual({ ...expectedInitialFilterContext, data: dataToUpsert });
//     });

//     it('when FILTER_SET_DEFINITION event with data, should set new, passed data, to filterContext and emit expandFilter for component', async () => {
//       // Arrange
//       router.routerState.root.snapshot.queryParams = { newThirdField: 'true' };

//       fixture.detectChanges();
//       await fixture.whenStable();

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;

//       dataFilterChildComponent.expandComponent = jasmine.createSpy('expandComponent');
//       const expectedInitialFilterContext = { ...component.filterContext };
//       const filterDefinitionToSet: FilterDefinition<any>[] = [
//         { fieldId: 'newThirdField' },
//         { fieldId: 'newFourthField' },
//       ];

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_SET_DEFINITION, filterDefinitionToSet);

//       // Assert
//       const fieldIdKey = Object.keys(router.routerState.root.snapshot.queryParams)[0];
//       const relatedFieldValue = router.routerState.root.snapshot.queryParams[fieldIdKey];
//       const expectedOptionsForExpandComponentArgs = { fieldId: fieldIdKey, value: relatedFieldValue };

//       expect(component.filterContext).toEqual({
//         ...expectedInitialFilterContext,
//         filterDefinition: filterDefinitionToSet,
//       });
//       expect(dataFilterChildComponent.expandComponent).toHaveBeenCalledWith(expectedOptionsForExpandComponentArgs);
//     });

//     it('when FILTER_SET_DEFINITION event with data, should set new, passed data, to filterContext and emit expandFilter for component', async () => {
//       // Arrange
//       fixture.detectChanges();
//       await fixture.whenStable();

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;

//       dataFilterChildComponent.expandComponent = jasmine.createSpy('expandComponent');
//       const expectedInitialFilterContext = { ...component.filterContext };
//       const filterDefinitionToSet: FilterDefinition<any>[] = [
//         { fieldId: 'newThirdField' },
//         { fieldId: 'newFourthField' },
//       ];

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_SET_DEFINITION, filterDefinitionToSet);

//       // Assert
//       expect(component.filterContext).toEqual({
//         ...expectedInitialFilterContext,
//         filterDefinition: filterDefinitionToSet,
//       });
//       expect(dataFilterChildComponent.expandComponent).not.toHaveBeenCalled();
//     });

//     it('when FILTER_RESET event, should call reset() of dataFilter component', async () => {
//       // Arrange
//       fixture.detectChanges();
//       await fixture.whenStable();

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;
//       dataFilterChildComponent.reset = jasmine.createSpy('reset');

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_RESET, null);

//       // Assert
//       expect(dataFilterChildComponent.reset).toHaveBeenCalled();
//     });

//     it('when FILTER_TOGGLE_OPTIONS event with data, should call toggleOptions(data) of dataFilter component', async () => {
//       // Arrange
//       fixture.detectChanges();
//       await fixture.whenStable();

//       dataFilterChildComponent = fixture.debugElement.query(By.directive(MockDataFilterComponent)).componentInstance;

//       dataFilterChildComponent.toggleOptions = jasmine.createSpy('toggleOptions');
//       const dataToPass = [{ fieldId: 'anyId', value: 'anyvalue' }];

//       // Act
//       messageBusService.sendMessage(FilterMessageBusMessages.FILTER_TOGGLE_OPTIONS, dataToPass);

//       // Assert
//       expect(dataFilterChildComponent.toggleOptions).toHaveBeenCalledWith(...dataToPass);
//     });
//   });

//   describe('#filterData', () => {
//     it('should send FILTER_DATA_FILTERED message with passed data', async () => {
//       // Arrange
//       const dataToPass = [{ testProperty: 'testValue', secondProperty: 123 }];

//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       component.filterData(dataToPass);

//       // Assert
//       expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_DATA_FILTERED, dataToPass);
//     });
//   });

//   describe('#filterExpanded', () => {
//     it('should send FILTER_OPENED message with null value as passed data', async () => {
//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       component.filterExpanded();

//       // Assert
//       expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_OPENED, null);
//     });
//   });

//   describe('#filterCollapsed', () => {
//     it('should send FILTER_CLOSED message with null value as passed data', async () => {
//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       component.filterCollapsed();

//       // Assert
//       expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_CLOSED, null);
//     });
//   });

//   describe('#filtering', () => {
//     it('should send FILTER_FILTERING message with passed data', async () => {
//       // Arrange
//       const dataToPass = { testProperty: 'testValue', secondProperty: 123 };

//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       component.filtering(dataToPass);

//       // Assert
//       expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_FILTERING, dataToPass);
//     });
//   });

//   describe('#filteringOptions', () => {
//     it('should send FILTER_FILTERING_OPTIONS message with passed data', async () => {
//       // Arrange
//       const dataToPass = {
//         testProperty: { firstOption: { checked: true, displayed: true, exactValue: 'exactValue', value: true } },
//       };

//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       component.filteringOptions(dataToPass);

//       // Assert
//       expect(sendMessageSpy).toHaveBeenCalledWith(FilterMessageBusMessages.FILTER_FILTERING_OPTIONS, dataToPass);
//     });

//     it('router shoudld navigate to rout with resolved query params', async () => {
//       // Arrange
//       const dataToPass = {
//         testProperty: { firstOption: { checked: true, displayed: true, exactValue: 'exactValue', value: true } },
//       };
//       const expectedParams: Params = { testProperty: 'firstOption' };

//       const routerNavigateSpy = jasmine.createSpy('router.navigate');
//       router.navigate = routerNavigateSpy;

//       // Act
//       fixture.detectChanges();
//       await fixture.whenStable();

//       component.filteringOptions(dataToPass);

//       // Assert
//       expect(routerNavigateSpy).toHaveBeenCalledWith([], { queryParams: expectedParams });
//     });
//   });
// });
