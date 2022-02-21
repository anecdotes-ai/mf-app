import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { reducers } from 'core/modules/data/store';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { FrameworksIconComponent } from './frameworks-icon.component';
import { of } from 'rxjs';
import { SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('FrameworksIconComponent', () => {
  let component: FrameworksIconComponent;
  let fixture: ComponentFixture<FrameworksIconComponent>;
  let frameworksFacade: FrameworksFacadeService;

  let frameworks = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatChipsModule, StoreModule.forRoot(reducers), TranslateModule.forRoot()],
      declarations: [FrameworksIconComponent],
      providers: [provideMockStore(), { provide: FrameworksFacadeService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworksIconComponent);
    component = fixture.componentInstance;

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getApplicableFrameworks = jasmine
      .createSpy('getApplicableFrameworks')
      .and.callFake(() => of(frameworks));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should filter related frameworks and sort them by names on each relatedFrameworks change', (done) => {
      // Arrange
      const relatedFrameworks = {
        'some-framework-1': ['control-1', 'control-2'],
        'some-framework-2': ['control-3', 'control-4'],
      };
      frameworks = [
        { framework_name: 'some-framework-2' },
        { framework_name: 'some-framework-1' },
        { framework_name: 'some-framework-3' },
      ];
      component.relatedFrameworks = relatedFrameworks;

      // Act
      fixture.detectChanges();
      component.ngOnChanges({
        relatedFrameworks: new SimpleChange(null, relatedFrameworks, true),
      });

      // Assert
      component.applicableRelatedFrameworks$.subscribe((applicableRelatedFrameworks) => {
        expect(applicableRelatedFrameworks).toEqual([
          { framework_name: 'some-framework-1', respective_controls: ['control-1', 'control-2'] },
          { framework_name: 'some-framework-2', respective_controls: ['control-3', 'control-4'] },
        ]);
        done();
      });
    });
  });

  describe('#joinControlNames', () => {
    it('should extract first part of control names, sort it and join with new line', () => {
      // Arrange
      const controlNames = ['C1.1 Some name', 'A1.2 Some name', 'A1.1 Some name', 'B1.1 Some name'];

      // Act
      const result = component.joinControlNames(controlNames);

      // Assert
      expect(result).toEqual(`A1.1\nA1.2\nB1.1\nC1.1`);
    });
  });
});
