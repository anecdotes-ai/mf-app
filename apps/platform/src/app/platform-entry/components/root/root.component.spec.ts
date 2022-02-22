/* tslint:disable:no-unused-variable */
import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdatesService } from 'core';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { RootComponent } from './root.component';

@Component({
  selector: 'app-navigation-bar',
})
class NavigationBarMockComponent {
  @Output()
  logoClick = new EventEmitter();
}

describe('RootComponent', () => {
  configureTestSuite();
  
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  let router: Router;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent, NavigationBarMockComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: FrameworksFacadeService, useValue: {} }, { provide: UpdatesService, useValue: {}}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy('navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
