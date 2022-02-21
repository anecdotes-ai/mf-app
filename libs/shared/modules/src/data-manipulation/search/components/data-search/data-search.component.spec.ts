/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService } from 'core';
import { SearchDefinitionModel } from '../../models';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { SearchOverlapsFoundEvent } from '../../models/search-overlap.model';
import { TextFieldComponent } from 'core/modules/form-controls';
import { DataSearchComponent } from './data-search.component';
import { SearchInstancesManagerService } from 'core/modules/data-manipulation/search';


describe('DataSearchComponent', () => {
  configureTestSuite();

  let componentUnderTest: DataSearchComponent;
  let fixture: ComponentFixture<DataSearchComponent>;

  let router: Router;
  let searchData: { entity_id: string; entity_name: string }[];
  let searchDefinition: SearchDefinitionModel<{ entity_id: string; entity_name: string }>[];
  let searchInstancesManagerServiceMock: SearchInstancesManagerService;
  let fakeSearchScopeKey: string;

  let messageBusService: MessageBusService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [DataSearchComponent, TextFieldComponent],
      providers: [
        { provide: MessageBusService, useValue: {} },
        { provide: SearchInstancesManagerService, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    searchData = [
      {
        entity_id: '5345345353',
        entity_name: 'FindFirstValue',
      },
      {
        entity_id: '7858567674',
        entity_name: 'FindSecondValue',
      },
      {
        entity_id: '35345435345',
        entity_name: 'this*is+third.value',
      },
      {
        entity_id: '23421231231',
        entity_name: 'that^is$fourth{}value?',
      },
      {
        entity_id: '23421231231',
        entity_name: 'it|is[]fifth()value\\',
      },
    ];

    searchDefinition = [
      {
        propertySelector: (c) => c.entity_name,
      },
    ];

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DataSearchComponent);
    componentUnderTest = fixture.componentInstance;

    searchInstancesManagerServiceMock = TestBed.inject(SearchInstancesManagerService);
    fakeSearchScopeKey = 'fake-search-scope-key';
    searchInstancesManagerServiceMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.returnValue(fakeSearchScopeKey);
    searchInstancesManagerServiceMock.addDataSearch = jasmine.createSpy('addDataSearch');
    searchInstancesManagerServiceMock.removeDataSearch = jasmine.createSpy('removeDataSearch');

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('instance registration', () => {
    it('should get search scope key by native element', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getSearchScopeKey).toHaveBeenCalledWith(
        fixture.debugElement.nativeElement
      );
    });

    it('should add itself by searchScopeKey to SearchInstancesManagerService on initialization', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.addDataSearch).toHaveBeenCalledWith(fakeSearchScopeKey, componentUnderTest);
    });

    it('should add remove itself by searchScopeKey from SearchInstancesManagerService on destruction', () => {
      // Arrange
      fixture.detectChanges();

      // Act
      fixture.destroy();

      // Assert
      expect(searchInstancesManagerServiceMock.removeDataSearch).toHaveBeenCalledWith(fakeSearchScopeKey);
    });
  });

  describe('data property value gets changed', () => {
    it('Should emit "search" event if data is provided', async () => {
      // Arrange
      componentUnderTest.data = searchData;
      spyOn(componentUnderTest.search, 'emit');

      // Act
      componentUnderTest.data = [...searchData];

      // Assert
      expect(componentUnderTest.search.emit).toHaveBeenCalledWith(searchData);
    });

    it('should not emit "search" event if "data" is not provided', async () => {
      // Arrange
      spyOn(componentUnderTest.search, 'emit');

      // Act
      componentUnderTest.data = undefined;

      // Assert
      expect(componentUnderTest.search.emit).not.toHaveBeenCalledWith(searchData);
    });

    // Temprary commented
    // it('should search an element by text if expected text is typed to TextFieldComponent', async () => {
    //   // Arrange
    //   const searchString = 'FindFirstValue';
    //   componentUnderTest.searchField.setValue(searchString);
    //   componentUnderTest.searchDefinitions = searchDefinition;

    //   spyOn(componentUnderTest.search, 'emit');

    //   // Act
    //   fixture.detectChanges();
    //   await fixture.whenStable();
    //   componentUnderTest.data = [...searchData];

    //   // Assert
    //   const expectedValue = searchData.find((el) => el.entity_name === searchString);
    //   expect(expectedValue).toBeTruthy();
    //   expect(componentUnderTest.search.emit).toHaveBeenCalledWith([expectedValue]);
    // });

    it('should return empty array if no items found by text', async () => {
      // Arrange
      const searchString = 'notFoundItems';
      componentUnderTest.searchField.setValue(searchString);
      componentUnderTest.data = searchData;
      componentUnderTest.searchDefinitions = searchDefinition;

      spyOn(componentUnderTest.search, 'emit');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      componentUnderTest.data = [...searchData];

      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(componentUnderTest.search.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('#ngAfterViewInit', () => {
    it('should write value to searchField and call valueChange if URL contains searchQuery param', async () => {
      // Arrange
      const providedSearchTextInQuery = 'queryProvidedWithSearchText';
      await router.navigate([], { queryParams: { searchQuery: providedSearchTextInQuery } });

      componentUnderTest.data = searchData;
      spyOn(componentUnderTest, 'valueChange');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(componentUnderTest.searchField.value).toBe(providedSearchTextInQuery);
      expect(componentUnderTest.valueChange).toHaveBeenCalled();
    });
  });

  describe('#valueChange', () => {
    it('if new value provided, should rewrite searchQuery param', async () => {
      // Arrange
      const newSearchString = 'anyNewSearchString';
      const initialSearchTextInQuery = 'queryProvidedWithSearchText';
      await router.navigate([], { queryParams: { searchQuery: initialSearchTextInQuery } });

      spyOn(router, 'navigate');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Simulation of inputing new text
      componentUnderTest.searchField.setValue(newSearchString);

      componentUnderTest.valueChange(new Event('anyEvent'));

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams: { searchQuery: newSearchString } });
    });

    it('if new provided value is empty string, should delete searchQuery param', async () => {
      // Arrange
      const newEmptySearchString = '';
      const initialSearchTextInQuery = 'queryProvidedWithSearchText';
      await router.navigate([], { queryParams: { searchQuery: initialSearchTextInQuery } });

      spyOn(router, 'navigate');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Simulation of inputing new text
      componentUnderTest.searchField.setValue(newEmptySearchString);

      componentUnderTest.valueChange(new Event('anyEvent'));

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams: {} });
    });
  });

  describe('#reset', () => {
    it('should reset text input value and emit all data', async () => {
      // Arrange
      const newSearchString = 'anyNewSearchString';
      componentUnderTest.searchField.setValue(newSearchString);

      componentUnderTest.data = searchData;
      spyOn(componentUnderTest.search, 'emit');

      spyOn(router, 'navigate');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      componentUnderTest.reset();

      // Assert
      expect(componentUnderTest.search.emit).toHaveBeenCalledWith(searchData);
      expect(componentUnderTest.searchField.value).toBeNull();
    });
  });

  describe('#handleSearchKeysCombination', () => {
    it('if F+CTRL combination pressed, should focus the textInput', async () => {
      // Arrange
      const textFieldComponentDebugElement = fixture.debugElement.query(By.directive(TextFieldComponent));

      componentUnderTest.data = searchData;
      spyOn(componentUnderTest.search, 'emit');

      spyOn(router, 'navigate');

      const initEvent: KeyboardEventInit = {
        key: 'f',
        ctrlKey: true,
        metaKey: true,
      };

      const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', initEvent);

      spyOn(keyEvent, 'preventDefault');
      spyOn(keyEvent, 'stopPropagation');
      spyOn(textFieldComponentDebugElement.componentInstance, 'focus');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      document.dispatchEvent(keyEvent);

      // Assert
      expect(textFieldComponentDebugElement.componentInstance.focus).toHaveBeenCalled();
      expect(keyEvent.stopPropagation).toHaveBeenCalled();
      expect(keyEvent.preventDefault).toHaveBeenCalled();
    });

    it('if F+CTRL combination not pressed, should not handle keys', async () => {
      // Arrange
      const textFieldComponentDebugElement = fixture.debugElement.query(By.directive(TextFieldComponent));

      componentUnderTest.data = searchData;
      spyOn(componentUnderTest.search, 'emit');

      spyOn(router, 'navigate');

      const initEvent: KeyboardEventInit = {
        key: 'e',
        ctrlKey: false,
        metaKey: false,
      };

      const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', initEvent);

      spyOn(keyEvent, 'preventDefault');
      spyOn(keyEvent, 'stopPropagation');
      spyOn(textFieldComponentDebugElement.componentInstance, 'focus');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      document.dispatchEvent(keyEvent);

      // Assert
      expect(textFieldComponentDebugElement.componentInstance.focus).not.toHaveBeenCalled();
      expect(keyEvent.stopPropagation).not.toHaveBeenCalled();
      expect(keyEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('search behavior', () => {
    beforeEach(() => {
      componentUnderTest.data = searchData;
      componentUnderTest.searchDefinitions = searchDefinition;
    });

    it('should emit overlapsFound with SearchOverlapsFoundEvent and found overlaps', () => {
      // Arrange
      const searchString = 'Fi';
      componentUnderTest.searchField.setValue(searchString);
      spyOn(componentUnderTest.overlapsFound, 'emit');

      const overlaps = [
        {
          overlapsCount: 2,
          object: {
            entity_id: '5345345353',
            entity_name: 'FindFirstValue',
          },
        },
        {
          overlapsCount: 1,
          object: {
            entity_id: '7858567674',
            entity_name: 'FindSecondValue',
          },
        },
        {
          overlapsCount: 1,
          object: {
            entity_id: '23421231231',
            entity_name: 'it|is[]fifth()value\\',
          }
        }
      ];

      // Act
      componentUnderTest.valueChange(new Event('anyEvent'));

      // Assert
      expect(componentUnderTest.overlapsFound.emit).toHaveBeenCalledWith(new SearchOverlapsFoundEvent(overlaps));
    });

    describe('data filtering', () => {
      beforeEach(() => {
        spyOn(componentUnderTest.search, 'emit');
      });

      it('should emit search with correctly filtered data if search string contains upper case characters', () => {
        // Arrange
        const searchString = 'Fi';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '5345345353',
            entity_name: 'FindFirstValue',
          },
          {
            entity_id: '7858567674',
            entity_name: 'FindSecondValue',
          },
          {
            entity_id: '23421231231',
            entity_name: 'it|is[]fifth()value\\',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains dot (.)', () => {
        // Arrange
        const searchString = 'third.';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '35345435345',
            entity_name: 'this*is+third.value',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains asterisk (*)', () => {
        // Arrange
        const searchString = 'this*';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '35345435345',
            entity_name: 'this*is+third.value',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains plus (+)', () => {
        // Arrange
        const searchString = 'is+';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '35345435345',
            entity_name: 'this*is+third.value',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains question mark (?)', () => {
        // Arrange
        const searchString = 'value?';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'that^is$fourth{}value?',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains caret (^)', () => {
        // Arrange
        const searchString = 'that^';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'that^is$fourth{}value?',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains dollar sign ($)', () => {
        // Arrange
        const searchString = 'is$';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'that^is$fourth{}value?',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains curly brackets ({})', () => {
        // Arrange
        const searchString = 'fourth{}';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'that^is$fourth{}value?',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains round brackets (())', () => {
        // Arrange
        const searchString = 'fifth()';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'it|is[]fifth()value\\',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains vertical bar (|)', () => {
        // Arrange
        const searchString = 'it|';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'it|is[]fifth()value\\',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains square brackets ([])', () => {
        // Arrange
        const searchString = 'is[]';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'it|is[]fifth()value\\',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });

      it('should emit search with correctly filtered data if search string contains backslash (\\)', () => {
        // Arrange
        const searchString = 'value\\';
        componentUnderTest.searchField.setValue(searchString);

        const foundData = [
          {
            entity_id: '23421231231',
            entity_name: 'it|is[]fifth()value\\',
          }
        ];

        // Act
        componentUnderTest.valueChange(new Event('anyEvent'));

        // Assert
        expect(componentUnderTest.search.emit).toHaveBeenCalledWith(foundData);
      });
    });
  });
});
