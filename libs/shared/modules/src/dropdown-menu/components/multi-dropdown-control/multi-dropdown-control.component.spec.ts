import { OverlayModule } from '@angular/cdk/overlay';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MultiDropdownControlComponent } from './multi-dropdown-control.component';
import { By } from '@angular/platform-browser';

export const mockTscList = ['tsc1.1', 'tsc1.2', 'tsc1.3'];
export const change: SimpleChange = new SimpleChange([], mockTscList, true);
export const changes: SimpleChanges = { data: change };

describe('MultiDropdownControlComponent', () => {
  configureTestSuite();

  let component: MultiDropdownControlComponent;
  let fixture: ComponentFixture<MultiDropdownControlComponent>;
  let translateService: TranslateService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), OverlayModule],
      declarations: [MultiDropdownControlComponent],
      providers: [{ provide: TranslateService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDropdownControlComponent);
    component = fixture.componentInstance;
    component.getDisplayValue = jasmine.createSpy('getDisplayValue').and.callThrough();
    component.updateData = jasmine.createSpy('updateData').and.callThrough();
    component.data = mockTscList;

    translateService = TestBed.inject(TranslateService);
    translateService.instant = jasmine.createSpy('instant').and.callFake((label) => label);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should set null to initial value if no initial selected values are passed', async () => {
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.value).toBeNull();
    });
  });

  describe('#ngOnChanges', () => {
    it('should set list of TSC accordingly to provided data Input', async () => {
      // Arrange
      component.data = mockTscList;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.ngOnChanges(changes);

      // Assert
      expect(component.displayedData).toEqual(mockTscList);
    });
  });

  describe('#getItemId', () => {
    it('should return string representation of data item if no id selector is passed', () => {
      // Act
      const res = component.getItemId('blabla');

      // Assert
      expect(res).toEqual('blabla');
    });

    it('should return result of passed id selector if id selector is passed', () => {
      // Arrange
      component.idSelector = (item) => item.id;

      // Act
      const res = component.getItemId({ id: 'blabla' });

      // Assert
      expect(res).toEqual('blabla');
    });
  });

  describe('#toggleDropdown', () => {
    it('should set isDropdownOpened to opposite', () => {
      // Arrange
      component.isDropdownOpened = false;

      // Act
      component.toggleDropdown();

      // Assert
      expect(component.isDropdownOpened).toBeTrue();
    });

    it('should set dirtyness to true when toggling a dropdown', async () => {
      // Arrange
      spyOn(component, 'markAsDirty');

      // Act
      component.toggleDropdown();

      // Assert
      expect(component.markAsDirty).toHaveBeenCalled();
    });
  });

  describe('#updateData', () => {
    it('should call updateData if if option was chosen', async () => {
      // Arrange
      component.isDropdownOpened = true;
      component.displayedData = mockTscList.map((item) => {
        return { [item]: false };
      });

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.debugElement.query(By.css('app-checkbox')).triggerEventHandler('changeValue', {});

      // Assert
      expect(component.updateData).toHaveBeenCalled();
    });
  });
});
