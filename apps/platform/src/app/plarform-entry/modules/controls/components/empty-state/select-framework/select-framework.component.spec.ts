import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { reducers } from 'core/modules/data/store';
import { SelectFrameworkComponent } from './select-framework.component';

describe('SelectFrameworkComponent', () => {
  let component: SelectFrameworkComponent;
  let fixture: ComponentFixture<SelectFrameworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)],
      declarations: [SelectFrameworkComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFrameworkComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#selectFramework', () => {
    it('should emit frameworkSelected with selected framework', () => {
      // Arrange
      spyOn(component.frameworkSelected, 'emit');

      // Act
      component.selectFramework({ framework_id: 'some-framework' });

      // Assert
      expect(component.frameworkSelected.emit).toHaveBeenCalledWith({ framework_id: 'some-framework' });
    });
  });

  describe('class binding', () => {
    it('should bind selected class on each selected item', async () => {
      // Arrange
      const selectedFramework = { framework_id: 'some-framework' };
      component.frameworks = [selectedFramework, { framework_id: 'some-framework-2' }];
      component.selectedFrameworks = new Set([selectedFramework]);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.queryAll(By.css('.framework'))[0].classes['selected']).toBeTruthy();
    });

    it('should not bind selected class if item is not selected', async () => {
      // Arrange
      const selectedFramework = { framework_id: 'some-framework' };
      component.frameworks = [selectedFramework, { framework_id: 'some-framework-2' }];
      component.selectedFrameworks = new Set([selectedFramework]);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.queryAll(By.css('.framework'))[1].classes['selected']).toBeFalsy();
    });
  });
});
