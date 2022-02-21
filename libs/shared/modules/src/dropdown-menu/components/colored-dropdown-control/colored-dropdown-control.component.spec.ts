import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { ColoredDropdownControlComponent } from './colored-dropdown-control.component';

@Injectable()
export class TranslationServiceMock {
  onLangChange: EventEmitter<any> = new EventEmitter();
  onTranslationChange: EventEmitter<any> = new EventEmitter();
  onDefaultLangChange: EventEmitter<any> = new EventEmitter();

  get(key: any): any {
    return of(key);
  }
}

@Component({
  selector: 'app-host',
  template: `
    <app-colored-dropdown-control
      [formControl]="formControl"
      [buttonBackgroundClass]="buttonBackgroundClass"
      [entityNameText]="entityNameText"
      [noValueTextTranslationKey]="noValueTextTranslationKey"
      [arrowEnabled]="arrowEnabled"
      (addNew)="addNew($event)">
    </app-colored-dropdown-control>
  `,
})
export class HostComponent {
  formControl = new FormControl();
  buttonBackgroundClass: string;
  entityNameText: string;
  noValueTextTranslationKey: string;
  arrowEnabled: boolean;
  addNew = jasmine.createSpy('addNew');
}

describe('ColoredDropdownControlComponent', (): void => {
  configureTestSuite();

  let fixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;
  let componentUnderTest: ColoredDropdownControlComponent;

  beforeAll((): void => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [ColoredDropdownControlComponent, HostComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          }
        }),
        OverlayModule,
      ],
      providers: [{ provide: TranslateService, useClass: TranslationServiceMock }],
    });
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(ColoredDropdownControlComponent)).componentInstance;

    fixture.detectChanges();
  });

  it('should render the component', (): void => {
    // Arrange
    // Act
    // Assert
    expect(componentUnderTest).toBeTruthy();
  });

  describe('addNew emitter', (): void => {
    it('should emit the value', (): void => {
      // Arrange
      spyOn(componentUnderTest.addNew, 'emit');

      // Act
      componentUnderTest.addClick();

      // Assert
      expect(componentUnderTest.addNew.emit).toHaveBeenCalled();
    });
  });
});
