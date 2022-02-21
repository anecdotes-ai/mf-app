import { SimpleChanges, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { DataSearchComponent, SearchInstancesManagerService } from 'core/modules/data-manipulation/search';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { SearchableTextComponent } from './searchable-text.component';

describe('SearchableTextComponent', () => {
  configureTestSuite();

  let component: SearchableTextComponent;
  let fixture: ComponentFixture<SearchableTextComponent>;
  let searchInstancesManagerServiceMock: SearchInstancesManagerService;
  let fakeSearchScopeKey: string;
  let dataSearchMock: DataSearchComponent;
  let fakeSearchField: FormControl;
  let updatedText: string;
  let changes: SimpleChanges;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableTextComponent],
      providers: [{ provide: SearchInstancesManagerService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableTextComponent);
    component = fixture.componentInstance;

    fakeSearchScopeKey = 'fake-search-key';
    fakeSearchField = new FormControl();
    dataSearchMock = {
      searchField: fakeSearchField,
    } as any;
    searchInstancesManagerServiceMock = TestBed.inject(SearchInstancesManagerService);
    searchInstancesManagerServiceMock.getSearchScopeKey = jasmine
      .createSpy('getSearchScopeKey')
      .and.returnValue(fakeSearchScopeKey);
    searchInstancesManagerServiceMock.getDataSearch = jasmine
      .createSpy('getDataSearch')
      .and.returnValue(of(dataSearchMock));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search functionality', () => {
    it('should get search scope key by native element', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getSearchScopeKey).toHaveBeenCalledWith(
        fixture.debugElement.nativeElement
      );
    });

    it('should get data search by search scope key', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(searchInstancesManagerServiceMock.getDataSearch).toHaveBeenCalledWith(fakeSearchScopeKey);
    });
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.text = 'initial text';
    });

    it(`should set textWithHighlights to initial text if search text became empty on searchField value changes`, () => {
      // Arrange

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('');

      // Assert
      expect(component.textWithHighlights).toEqual(component.text);
    });

    it(`should set textWithHighlights to initial text if no match with search text was found on searchField value changes`, () => {
      // Arrange

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('anything');

      // Assert
      expect(component.textWithHighlights).toEqual(component.text);
    });

    it(`should set textWithHighlights to text with highlighted results if match with search text was found on searchField value changes`, () => {
      // Arrange

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('initial');

      // Assert
      expect(component.textWithHighlights).toEqual(`<span class='search-highlight'>initial</span> text`);
    });

    it(`should correctly highlight results if search string contains dot (.)`, () => {
      // Arrange
      component.text = 'initial text.';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text.');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text.</span>`);
    });

    it(`should correctly highlight results if search string contains asterisk (*)`, () => {
      // Arrange
      component.text = 'initial text*';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text*');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text*</span>`);
    });

    it(`should correctly highlight results if search string contains plus (+)`, () => {
      // Arrange
      component.text = 'initial text+';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text+');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text+</span>`);
    });

    it(`should correctly highlight results if search string contains question mark (?)`, () => {
      // Arrange
      component.text = 'initial text?';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text?');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text?</span>`);
    });

    it(`should correctly highlight results if search string contains caret (^)`, () => {
      // Arrange
      component.text = 'initial text^';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text^');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text^</span>`);
    });

    it(`should correctly highlight results if search string contains dollar sign ($)`, () => {
      // Arrange
      component.text = 'initial text$';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text$');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text$</span>`);
    });

    it(`should correctly highlight results if search string contains curly brackets ({})`, () => {
      // Arrange
      component.text = 'initial text{}';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text{}');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text{}</span>`);
    });

    it(`should correctly highlight results if search string contains round brackets (())`, () => {
      // Arrange
      component.text = 'initial text()';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text()');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text()</span>`);
    });

    it(`should correctly highlight results if search string contains vertical bar (|)`, () => {
      // Arrange
      component.text = 'initial text|';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text|');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text|</span>`);
    });

    it(`should correctly highlight results if search string contains square brackets ([])`, () => {
      // Arrange
      component.text = 'initial text[]';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text[]');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text[]</span>`);
    });

    it(`should correctly highlight results if search string contains backslash (\\)`, () => {
      // Arrange
      component.text = 'initial text\\';

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('text\\');

      // Assert
      expect(component.textWithHighlights).toEqual(`initial <span class='search-highlight'>text\\</span>`);
    });
  });

  describe('host listeners & bindings', () => {
    it('should emit focusIn and set in-focus class on host when focusTerm event dispatched on host', () => {
      // Arrange
      spyOn(component.focusIn, 'emit');

      // Act
      fixture.debugElement.nativeElement.dispatchEvent(new Event('focusTerm'));
      fixture.detectChanges();

      // Assert
      expect(component.focusIn.emit).toHaveBeenCalled();
      expect(fixture.debugElement.nativeElement.classList.contains('in-focus')).toBeTruthy();
    });

    it('should emit focusLeave and remove in-focus class on host when focusTermRemoved event dispatched on host', () => {
      // Arrange
      spyOn(component.focusLeave, 'emit');

      // Act
      fixture.debugElement.nativeElement.dispatchEvent(new Event('focusTermRemoved'));
      fixture.detectChanges();

      // Assert
      expect(component.focusLeave.emit).toHaveBeenCalled();
      expect(fixture.debugElement.nativeElement.classList.contains('in-focus')).toBeFalsy();
    });
  });

  describe('text changes', () => {
    beforeEach(() => {
      component.text = 'initial text';
      updatedText = 'not Initial text';
      changes = { text: new SimpleChange(null, updatedText, false) };
    });

    it(`should update text in the DOM after text is changed`, () => {
      // Act
      fakeSearchField.setValue('');
      component.text = updatedText;
      fixture.detectChanges();
      component.ngOnChanges(changes);

      // Assert
      expect(fixture.debugElement.nativeElement.innerText).toEqual(updatedText);
    });

    it(`should highlight relevant text after text changed`, () => {
      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('not');
      component.text = updatedText;
      component.ngOnChanges(changes);

      // Assert
      expect(component.textWithHighlights).toEqual(`<span class='search-highlight'>not</span> Initial text`);
    });

    it(`should not hightlight anything if text changed to matching search results`, () => {
      // Arrange
      updatedText = 'not';
      changes = { text: new SimpleChange(null, updatedText, false) };

      // Act
      fakeSearchField.setValue('initial');
      component.text = updatedText;
      component.ngOnChanges(changes);

      // Assert
      expect(component.textWithHighlights).toEqual(component.text);
    });

    it(`should do nothing if this is the first change`, () => {
      // Arrange
      updatedText = 'not';
      changes = { text: new SimpleChange(null, updatedText, true) };

      // Act
      fixture.detectChanges();
      fakeSearchField.setValue('initial');
      component.text = updatedText;
      component.ngOnChanges(changes);

      // Assert
      expect(fixture.debugElement.nativeElement.innerText).toEqual('initial text');
    });
  });
});
