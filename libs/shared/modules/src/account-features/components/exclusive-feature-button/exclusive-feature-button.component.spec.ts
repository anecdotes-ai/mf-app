/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonSize, ButtonType } from 'core/modules/buttons/types';
import { configureTestSuite } from 'ng-bullet';
import { ExclusiveFeatureModalService } from '../../services';
import { ExclusiveFeatureButtonComponent } from './exclusive-feature-button.component';

describe('ExclusiveFeatureButtonComponent', () => {
  configureTestSuite();

  let component: ExclusiveFeatureButtonComponent;
  let fixture: ComponentFixture<ExclusiveFeatureButtonComponent>;
  let exclusiveFeatureModalServiceMock: ExclusiveFeatureModalService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExclusiveFeatureButtonComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ExclusiveFeatureModalService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveFeatureButtonComponent);
    component = fixture.componentInstance;
    exclusiveFeatureModalServiceMock = TestBed.inject(ExclusiveFeatureModalService);
    exclusiveFeatureModalServiceMock.openExclusiveFeatureModal = jasmine.createSpy('openExclusiveFeatureModal');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicked', () => {
    it('should call openExclusiveFeatureModal', () => {
      // Arrange
      // Act
      fixture.debugElement.triggerEventHandler('click', {});

      // Assert
      expect(exclusiveFeatureModalServiceMock.openExclusiveFeatureModal).toHaveBeenCalled();
    });
  });

  describe('type input', () => {
    it('should be set to primary by default', () => {
      // Arrange
      // Act
      // Assert
      expect(component.type).toBe('primary');
    });

    (['primary', 'secondary'] as ButtonType[]).forEach((type) => {
      it(`should have type attribute equal to ${type}`, () => {
        // Arrange
        component.type = type;

        // Act
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.attributes['type']).toBe(type);
      });
    });
  });

  describe('size input', () => {
    it('should be set to medium by default', () => {
      // Arrange
      // Act
      // Assert
      expect(component.size).toBe('medium');
    });

    (['medium', 'small', 'stretch', 'responsive'] as ButtonSize[]).forEach((size) => {
      it(`should have '${size}' class`, () => {
        // Arrange
        component.size = size;

        // Act
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.classes[size]).toBeTruthy();
      });
    });
  });

  it('should have role attribute equal to button', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.attributes['role']).toBe('button');
  });

  it('should have btn class', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['btn']).toBeTruthy();
  });

  it('should have disabled class when disabled input is true', () => {
    // Arrange
    component.disabled = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['disabled']).toBeTruthy();
  });

  it('should not have disabled class when disabled input is false', () => {
    // Arrange
    component.disabled = false;

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['disabled']).toBeFalsy();
  });
});
