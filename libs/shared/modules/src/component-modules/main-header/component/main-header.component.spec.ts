import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MainHeaderComponent } from './main-header.component';
import { configureTestSuite } from 'ng-bullet';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { BehaviorSubject, Observable } from 'rxjs';

describe('MainHeaderComponent', () => {
  configureTestSuite();
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;
  let filterManagerService: DataFilterManagerService;
  let filterToggleEvent = new BehaviorSubject(true);

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MainHeaderComponent],
      providers: [{ provide: DataFilterManagerService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
    component.inputModel = { translationRootKey: 'bla' };

    filterManagerService = TestBed.inject(DataFilterManagerService);
    filterManagerService.getToggledEvent = jasmine
      .createSpy('getToggledEvent')
      .and.callFake(() => filterToggleEvent as Observable<boolean>);
    filterManagerService.open = jasmine.createSpy('open');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
