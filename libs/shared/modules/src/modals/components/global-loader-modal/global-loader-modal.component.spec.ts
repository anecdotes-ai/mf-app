import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalLoaderModalComponent } from './global-loader-modal.component';
import { ModalWindowService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import {
  GlobalLoaderModalWindowInputKeys,
  GlobalLoaderModalWindowSharedContext,
  GlobalLoaderModalWindowSharedContextInputKeys
} from 'core/modules/modals/components/global-loader-modal/constants';
import { of } from 'rxjs';

describe('GlobalLoaderModalComponent', () => {
  let component: GlobalLoaderModalComponent;
  let fixture: ComponentFixture<GlobalLoaderModalComponent>;
  let switcherMock: ComponentSwitcherDirective;
  let modalWindowService: ModalWindowService;
  let fakeContext: GlobalLoaderModalWindowSharedContext;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalLoaderModalComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLoaderModalComponent);
    component = fixture.componentInstance;
    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.close = jasmine.createSpy('close');
    switcherMock.sharedContext$ = of({ fakeContext });
    switcherMock.goById = jasmine.createSpy('goById');
    fakeContext = {
      [GlobalLoaderModalWindowSharedContextInputKeys.description]: 'string',
      [GlobalLoaderModalWindowSharedContextInputKeys.loadingHandlerFunction]: () => { }
    };
    component.errorWindowSwitcherId = 'errorId';
    component.successWindowSwitcherId = 'successId';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
