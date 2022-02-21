import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ControlNoAdoptedFrameworksComponent } from './control-no-adopted-frameworks.component';

describe('ControlNoAdoptedFrameworksComponent', () => {
  let component: ControlNoAdoptedFrameworksComponent;
  let fixture: ComponentFixture<ControlNoAdoptedFrameworksComponent>;

  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: Router, useValue: {} }],
      declarations: [ControlNoAdoptedFrameworksComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ControlNoAdoptedFrameworksComponent);
    component = fixture.componentInstance;
    router.navigate = jasmine.createSpy('navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#navigateToFrameworks', () => {
    it('should navigate to "frameworks" page', async () => {
      // Arrange
      // Act
      component.navigateToFrameworks();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['frameworks']);
    });
  });
});
