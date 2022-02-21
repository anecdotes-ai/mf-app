import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationExtras, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, DataSelectDefinition, WindowHelperService } from 'core';
import { DataSelectComponent } from './data-select.component';


class MockRouter {
  routerState: {
    snapshot: {
      root: {
        queryParams: Params;
      };
    };
  };

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }

  constructor() {
    this.routerState = { snapshot: { root: { queryParams: {} } } };
  }
}

describe('DataSelectComponent', () => {
  let component: DataSelectComponent;
  let fixture: ComponentFixture<DataSelectComponent>;

  let mockRouter: MockRouter;
  let mockDataSelectDefinition: DataSelectDefinition<any>;
  let mockData: any[];
  let windowHelperService: WindowHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataSelectComponent],
      imports: [
        MatMenuModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: WindowHelperService,
          useValue: {
            getWindow: jasmine.createSpy('getWindow').and.returnValue({
              localStorage: { setItem: jasmine.createSpy('setItem') },
            }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockRouter = TestBed.inject(Router);
    windowHelperService = TestBed.inject(WindowHelperService);

    mockDataSelectDefinition = {
      fieldId: 'mockFieldId',
      valueSelector: (x) => x.mockPropertyTest,
      idSelector: (x) => x.mockPropertyTest,
    };

    mockData = [
      { id: 'bla2', anyProperty: 'value' },
      { id: 'bla1', anyProperty: 'value2' },
      { id: 'bla3', anyProperty3: 'value3' },
    ];

    component.dataSelectDefinition = mockDataSelectDefinition;
    component.trackBy = (x) => x.id;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should set selectdItem, from first element of passed "data"array, when it is not selected and emit select event', async () => {
      // Arrange
      const changes: SimpleChanges = {
        data: new SimpleChange(null, mockData, true),
      };

      component.data = mockData;

      spyOn(component.select, 'emit');
      spyOn(mockRouter, 'navigate');
      expect(component.selectedItem).toBeFalsy();

      // Act
      fixture.detectChanges();
      component.ngOnChanges(changes);
      await fixture.whenStable();

      // Assert
      expect(component.selectedItem).toBe(mockData[0]);
      expect(component.select.emit).toHaveBeenCalledWith(mockData[0]);
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { [mockDataSelectDefinition.fieldId]: mockDataSelectDefinition.idSelector(mockData[0]) },
      });
    });

    it('should not set selectdItem when it is already selected and should not emit select event', async () => {
      // Arrange
      const changes: SimpleChanges = {
        data: new SimpleChange(null, mockData, true),
      };

      component.data = mockData;
      component.selectedItem = mockData[1];

      spyOn(component.select, 'emit');

      // Act
      fixture.detectChanges();
      component.ngOnChanges(changes);
      await fixture.whenStable();

      // Assert
      expect(component.selectedItem).toBe(mockData[1]);
      expect(component.select.emit).not.toHaveBeenCalled();
    });
  });

  describe('#selectItem', () => {
    it('should set selectdItem, emit select event, add queryParameters', async () => {
      // Arrange
      const newItemSelect = mockData[0];

      spyOn(component.select, 'emit');
      spyOn(mockRouter, 'navigate');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.selectItem(newItemSelect);

      // Assert
      expect(component.selectedItem).toBe(newItemSelect);
      expect(component.select.emit).toHaveBeenCalledWith(newItemSelect);
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { [mockDataSelectDefinition.fieldId]: mockDataSelectDefinition.idSelector(newItemSelect) },
      });
    });

    it('should set selectdItem, emit select event, add queryParameters and write state to local storage if saveState is true', async () => {
      // Arrange
      const newItemSelect = mockData[0];
      component.saveState = true;

      spyOn(component.select, 'emit');
      spyOn(mockRouter, 'navigate');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.selectItem(newItemSelect);

      // Assert
      expect(component.selectedItem).toBe(newItemSelect);
      expect(component.select.emit).toHaveBeenCalledWith(newItemSelect);
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { [mockDataSelectDefinition.fieldId]: mockDataSelectDefinition.idSelector(newItemSelect) },
      });
      expect(windowHelperService.getWindow().localStorage.setItem).toHaveBeenCalledWith(
        jasmine.any(String),
        mockDataSelectDefinition.idSelector(newItemSelect)
      );
    });

    describe('#selectItem - data changes', () => {
      let emitterSpy;

      beforeEach(() => {
        component.data = mockData;
        component.selectItem(mockData[0]);
        emitterSpy = spyOn(component.select, 'emit');
      });

      it('should not update selectdItem when item in data is changed', () => {
        // Arrange

        // Act
        mockData[2] = { id: 'bla1', anyProperty: 'newValue' };
        component.data = mockData;

        // Assert
        expect(emitterSpy.calls.count()).toBe(0);
      });

      it('should update selectdItem when data in item has changed', () => {
        // Arrange
        const oldMock = [...mockData];

        // Act
        mockData[0] = { id: 'bla2', anyProperty: 'newValue' };
        component.data = mockData;
        component.ngOnChanges({ data: new SimpleChange(oldMock, component.data, false) });

        // Assert
        expect(component.selectedItem).toBe(mockData[0]);
        expect(component.select.emit).toHaveBeenCalledWith(mockData[0]);
      });
    });
  });
});
