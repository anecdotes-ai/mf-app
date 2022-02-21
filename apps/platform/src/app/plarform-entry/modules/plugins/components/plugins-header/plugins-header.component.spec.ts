import { Service } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBusService } from 'core';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { PluginsHeaderComponent } from './plugins-header.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component, DebugElement, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-data-search',
  template: ``,
})
class MockDataSearchComponent {
  @Output()
  search = new EventEmitter();

  @Output()
  inputText = new EventEmitter<InputEvent>();
}

describe('PluginsHeaderComponent', () => {
  configureTestSuite();
  let component: PluginsHeaderComponent;
  let fixture: ComponentFixture<PluginsHeaderComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginsHeaderComponent, MockDataSearchComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: DataFilterManagerService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginsHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('afterViewInit', () => {
    it('should set afterViewHookInitiated to true', async () => {
      // Arrange
      expect(component.afterViewHookInitiated).toBeFalsy();

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.afterViewHookInitiated).toBeTrue();
    });
  });

  describe('Common properties', () => {
    it('searchDefinitions should have property selector by service_display_name', async () => {
      // Arrange
      const testPlugin: Service = { service_display_name: 'testDisplayName' };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.searchDefinitions.length === 1).toBeTrue();
      expect(component.searchDefinitions[0].propertySelector(testPlugin)).toEqual(testPlugin.service_display_name);
    });
  });

  describe('DataSearchComponent handlers', () => {
    let dataSearchComponent: MockDataSearchComponent;
    beforeEach(async () => {
      dataSearchComponent = fixture.debugElement.query(By.directive(MockDataSearchComponent))
        .componentInstance as MockDataSearchComponent;

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('search.emit should be called when DataSearchComponent emit search event', async () => {
      // Arrange
      spyOn(component.search, 'emit');

      // Act
      dataSearchComponent.search.emit({});

      // Assert
      expect(component.search.emit).toHaveBeenCalled();
    });

    it('searchInputText.emit should be called when DataSearchComponent emit searchInput event', async () => {
      // Arrange
      spyOn(component.searchInputText, 'emit');

      // Act
      dataSearchComponent.inputText.emit({} as any);

      // Assert
      expect(component.searchInputText.emit).toHaveBeenCalled();
    });
  });

  describe('Suggest plugin button handler', () => {
    it('suggestPlugin.emit() should be executed when suggest plugin button clicked', async () => {
      // Arrange
      spyOn(component.suggestPlugin, 'emit');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const suggestPluginButton: DebugElement = fixture.debugElement.query(By.css('#suggest-plugin-header-button'));
      suggestPluginButton.triggerEventHandler('click', {});

      // Assert
      expect(component.suggestPlugin.emit).toHaveBeenCalled();
    });
  });
});
