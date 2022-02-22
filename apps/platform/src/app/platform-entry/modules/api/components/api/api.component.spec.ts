import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiComponent } from './api.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IntercomService } from 'core/services';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

describe('ApiComponent', () => {
  configureTestSuite();
  let fixture: ComponentFixture<ApiComponent>;
  let componentUnderTest: ApiComponent;
  let intercomService: IntercomService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getOpenIntercomBtn(): DebugElement {
    return fixture.debugElement.query(By.css('#openIntercom'));
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IntercomService, useValue: {} }
      ],
      declarations: [ApiComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiComponent);
    componentUnderTest = fixture.componentInstance;
    intercomService = TestBed.inject(IntercomService);
    intercomService.openMessanger = jasmine.createSpy('openMessager');
    fixture.detectChanges();
  });

  it('should be able to create component instance', () => {
    expect(componentUnderTest).toBeDefined();
  });

  describe('openIntercom()', () => {
    it('should call intercomService.openMessanger()', () => {
      // Act
      componentUnderTest.openIntercom();

      // Assert
      expect(intercomService.openMessanger).toHaveBeenCalled();
    });
  });

  describe('nextBtn', () => {
    it('should call next method when clicked on button', async () => {
      // Arrange
      spyOn(componentUnderTest, 'openIntercom');

      // Act
      getOpenIntercomBtn().triggerEventHandler('click', {});

      // Assert
      expect(componentUnderTest.openIntercom).toHaveBeenCalled();
    });
  });
});
