// import { Component, ViewChild } from '@angular/core';
// import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { TranslateModule } from '@ngx-translate/core';
// import { MessageBusService, SearchableTextComponent, SearchMessageBusMessages } from 'core';
// import { spyOnMessageBusMethods } from 'core/utils/testing';
// import { configureTestSuite } from 'ng-bullet';
// import { SearchResultsPaginationComponent } from './search-results-pagination.component';

// @Component({
//   selector: 'app-test',
//   template: `<div #scope>
//       <app-searchable-text text="test text 1"></app-searchable-text>
//       <app-searchable-text text="test text 2"></app-searchable-text>
//       <app-searchable-text text="test text 3"></app-searchable-text>
//     </div>
//     <app-search-results-pagination [scope]="scope" scopeKey="some-key"></app-search-results-pagination>`,
// })
// class TestComponent {
//   @ViewChild(SearchResultsPaginationComponent, { static: true }) paginator: SearchResultsPaginationComponent;
// }

// describe('SearchResultsPaginationComponent', () => {
//   configureTestSuite();

//   let component: TestComponent;
//   let fixture: ComponentFixture<TestComponent>;
//   let paginator: SearchResultsPaginationComponent;

//   let messageBusService: MessageBusService;

//   const getWrapper = (wrapperNumber: number) => {
//     return fixture.debugElement.query(By.css(`app-searchable-text:nth-child(${wrapperNumber})`)).nativeElement;
//   };

//   beforeAll(async(() => {
//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot()],
//       declarations: [TestComponent, SearchResultsPaginationComponent, SearchableTextComponent],
//       providers: [{ provide: MessageBusService, useValue: {} }],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(TestComponent);
//     component = fixture.componentInstance;
//     paginator = component.paginator;

//     messageBusService = TestBed.inject(MessageBusService);
//     spyOnMessageBusMethods(messageBusService);
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('#ngOnInit', () => {
//     let paginatorHost: Element;

//     beforeEach(() => {
//       const { nativeElement } = fixture.debugElement.query(By.directive(SearchResultsPaginationComponent));
//       paginatorHost = nativeElement;
//     });

//     it(`should hide paginator if search text passed in ${SearchMessageBusMessages.SEARCH_TEXT_CHANGED} is empty`, fakeAsync(() => {
//       // Arrange

//       // Act
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, '', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();

//       // Assert
//       expect(paginatorHost.classList.contains('hidden')).toBeTruthy();
//     }));

//     it(`should show paginator if search text passed in ${SearchMessageBusMessages.SEARCH_TEXT_CHANGED} is NOT empty`, fakeAsync(() => {
//       // Arrange

//       // Act
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();

//       // Assert
//       expect(paginatorHost.classList.contains('hidden')).toBeFalsy();
//     }));

//     it(`should return correct number of highlights if search text passed in ${SearchMessageBusMessages.SEARCH_TEXT_CHANGED} is NOT empty`, fakeAsync(() => {
//       // Arrange

//       // Act
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();

//       // Assert
//       expect(paginator.totalSearchResults).toEqual(3);
//     }));

//     it(`should set currentHighlightedResult to 0 if search text passed in ${SearchMessageBusMessages.SEARCH_TEXT_CHANGED} is NOT empty`, fakeAsync(() => {
//       // Arrange

//       // Act
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();

//       // Assert
//       expect(paginator.currentHighlightedResult).toEqual(0);
//     }));

//     it(`should dispatch focusTerm event on first result wrapper if search text passed in ${SearchMessageBusMessages.SEARCH_TEXT_CHANGED} is NOT empty`, fakeAsync(() => {
//       // Arrange
//       const wrapper = getWrapper(1);
//       spyOn(wrapper, 'dispatchEvent');

//       // Act
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();

//       // Assert
//       expect(wrapper.dispatchEvent).toHaveBeenCalledWith(new Event('focusTerm'));
//     }));

//     it(`should add current-highlight class on first result if search text passed in ${SearchMessageBusMessages.SEARCH_TEXT_CHANGED} is NOT empty`, fakeAsync(() => {
//       // Arrange
//       const wrapper = getWrapper(1);

//       // Act
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();

//       // Assert
//       const result = wrapper.querySelector('.search-highlight');
//       expect(result.classList.contains('current-highlight')).toBeTruthy();
//     }));
//   });

//   describe('#clearSearch', () => {
//     it(`should send ${SearchMessageBusMessages.CLEAR_SEARCH} message`, () => {
//       // Arrange

//       // Act
//       paginator.clearSearch();

//       // Assert
//       expect(messageBusService.sendMessage).toHaveBeenCalledWith(
//         SearchMessageBusMessages.CLEAR_SEARCH,
//         null,
//         paginator.scopeKey
//       );
//     });
//   });

//   describe('#goToNextSearchHighlight', () => {
//     beforeEach(fakeAsync(() => {
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();
//     }));

//     it(`should remove current-highlight class from previous result`, () => {
//       // Arrange
//       const wrapper = getWrapper(1);

//       // Act
//       paginator.goToNextSearchHighlight();

//       // Assert
//       const previous = wrapper.querySelector('.search-highlight');
//       expect(previous.classList.contains('current-highlight')).toBeFalsy();
//     });

//     it(`should correctly set currentHighlightedResult`, () => {
//       // Arrange

//       // Act
//       paginator.goToNextSearchHighlight();

//       // Assert
//       expect(paginator.currentHighlightedResult).toEqual(1);
//     });

//     it(`should dispatch focusTermRemoved on previous result wrapper if current result is in another wrapper`, () => {
//       // Arrange
//       const wrapper = getWrapper(1);
//       spyOn(wrapper, 'dispatchEvent');

//       // Act
//       paginator.goToNextSearchHighlight();

//       // Assert
//       expect(wrapper.dispatchEvent).toHaveBeenCalledWith(new Event('focusTermRemoved'));
//     });

//     it(`should dispatch focusTerm on current result wrapper if current result is in another wrapper`, () => {
//       // Arrange
//       const wrapper = getWrapper(2);
//       spyOn(wrapper, 'dispatchEvent');

//       // Act
//       paginator.goToNextSearchHighlight();

//       // Assert
//       expect(wrapper.dispatchEvent).toHaveBeenCalledWith(new Event('focusTerm'));
//     });

//     it(`should add current-highlight class to current result`, () => {
//       // Arrange
//       const wrapper = getWrapper(2);

//       // Act
//       paginator.goToNextSearchHighlight();

//       // Assert
//       const current = wrapper.querySelector('.search-highlight');
//       expect(current.classList.contains('current-highlight')).toBeTruthy();
//     });
//   });

//   describe('#goToPrevSearchHighlight', () => {
//     beforeEach(fakeAsync(() => {
//       fixture.detectChanges();
//       messageBusService.sendMessage(SearchMessageBusMessages.SEARCH_TEXT_CHANGED, 'text', paginator.scopeKey);
//       tick();
//       fixture.detectChanges();
//       paginator.goToNextSearchHighlight();
//     }));

//     it(`should remove current-highlight class from previous result`, () => {
//       // Arrange
//       const wrapper = getWrapper(2);

//       // Act
//       paginator.goToPrevSearchHighlight();

//       // Assert
//       const previous = wrapper.querySelector('.search-highlight');
//       expect(previous.classList.contains('current-highlight')).toBeFalsy();
//     });

//     it(`should correctly set currentHighlightedResult`, () => {
//       // Arrange

//       // Act
//       paginator.goToPrevSearchHighlight();

//       // Assert
//       expect(paginator.currentHighlightedResult).toEqual(0);
//     });

//     it(`should dispatch focusTermRemoved on previous result wrapper if current result is in another wrapper`, () => {
//       // Arrange
//       const wrapper = getWrapper(2);
//       spyOn(wrapper, 'dispatchEvent');

//       // Act
//       paginator.goToPrevSearchHighlight();

//       // Assert
//       expect(wrapper.dispatchEvent).toHaveBeenCalledWith(new Event('focusTermRemoved'));
//     });

//     it(`should dispatch focusTerm on current result wrapper if current result is in another wrapper`, () => {
//       // Arrange
//       const wrapper = fixture.debugElement.query(By.css('app-searchable-text:nth-child(1)')).nativeElement;
//       spyOn(wrapper, 'dispatchEvent');

//       // Act
//       paginator.goToPrevSearchHighlight();

//       // Assert
//       expect(wrapper.dispatchEvent).toHaveBeenCalledWith(new Event('focusTerm'));
//     });

//     it(`should add current-highlight class to current result`, () => {
//       // Arrange
//       const wrapper = fixture.debugElement.query(By.css('app-searchable-text:nth-child(1)')).nativeElement;

//       // Act
//       paginator.goToPrevSearchHighlight();

//       // Assert
//       const current = wrapper.querySelector('.search-highlight');
//       expect(current.classList.contains('current-highlight')).toBeTruthy();
//     });
//   });
// });
