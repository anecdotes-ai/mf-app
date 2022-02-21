import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreezeFrameworksModalComponent } from './freeze-frameworks-modal.component';
import { ModalWindowService } from 'core/modules/modals';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { of } from 'rxjs';


describe('FreezeFrameworksModalComponent', () => {
  let component: FreezeFrameworksModalComponent;
  let fixture: ComponentFixture<FreezeFrameworksModalComponent>;
  let frameworkFacadeMock: FrameworksFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreezeFrameworksModalComponent ],
      providers: [{ provide: FrameworksFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeFrameworksModalComponent);
    component = fixture.componentInstance;
    frameworkFacadeMock = TestBed.inject(FrameworksFacadeService);
    frameworkFacadeMock.getApplicableFrameworks = jasmine.createSpy('getApplicableFrameworks').and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
