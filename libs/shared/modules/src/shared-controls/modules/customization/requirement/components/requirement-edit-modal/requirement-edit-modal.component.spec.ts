import { EditRequirementModalEnum } from '../../models';
import { ControlRequirement, Requirement } from 'core/modules/data/models/domain';
import { RequirementEditSharedContext } from './../../services/requirement-customization-modal-service/requirement-edit-shared-context';
import { RequirementsFacadeService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementEditModalComponent } from './requirement-edit-modal.component';
import { ModalWindowService } from 'core/modules/modals';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BaseModalComponent } from 'core/modules/modals';
import { TranslateModule } from '@ngx-translate/core';

class MockRequirementsFacadeService {
  async updateRequirement(requirement: ControlRequirement): Promise<void> {}
}

class MockSwitcherDir {
  public sharedContext$: BehaviorSubject<RequirementEditSharedContext> = new BehaviorSubject<
    RequirementEditSharedContext
  >(null);

  goById(id: string): void {}
}

describe('RequirementEditModalComponent', () => {
  let component: RequirementEditModalComponent;
  let fixture: ComponentFixture<RequirementEditModalComponent>;

  let switcher: MockSwitcherDir;
  let facade: RequirementsFacadeService;

  const requirement: ControlRequirement = {
    requirement_id: 'test_req_id',
    requirement_name: 'Test Name',
    requirement_help: 'help test text',
  };
  const control = { control_id: 'test_control_id' };
  const framework = { framework_id: 'test_framework_id' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementEditModalComponent, BaseModalComponent],
      providers: [
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: ModalWindowService, useValue: {} },
        { provide: RequirementsFacadeService, useClass: MockRequirementsFacadeService },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementEditModalComponent);

    switcher = TestBed.inject(ComponentSwitcherDirective) as any;
    facade = TestBed.inject(RequirementsFacadeService);
    switcher.sharedContext$.next({ control, requirement, framework, translationKey: '' });

    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('#OnInit', () => {
    it('should get switcher context data', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.controlInstance).toBe(control);
      expect(component.currentFramework).toBe(framework);
      expect(component.controlRequirement).toBe(requirement);
    });

    it('should create a form and assign initial values', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.formGroup.controls['newRequirementName'].value).toBe(requirement.requirement_name);
      expect(component.formGroup.controls['description'].value).toBe(requirement.requirement_help);
    });
  });

  describe('#updateFormBtnClick', () => {
    it('should call updateRequirement method of requirementFacade service with changed form values', async () => {
      // Arrange
      facade.updateRequirement = jasmine.createSpy('updateRequirement');
      const testInputedName = 'TestName';
      const testInputedDescription = 'TestInputedDescription';

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.formGroup.controls['newRequirementName'].setValue(testInputedName);
      component.formGroup.controls['description'].setValue(testInputedDescription);
      await component.updateFormBtnClick();

      // Assert
      const funcAsJasmineSpy = facade.updateRequirement as jasmine.Spy<jasmine.Func>;
      const passedRequirementAsArgument = funcAsJasmineSpy.calls.mostRecent().args[1] as Requirement;

      expect(passedRequirementAsArgument.requirement_help).toBe(testInputedDescription);
      expect(passedRequirementAsArgument.requirement_description).toBe(testInputedName);
    });

    it('should switch to success modal when operation is success', async () => {
      // Arrange
      facade.updateRequirement = jasmine.createSpy('updateRequirement');
      switcher.goById = jasmine.createSpy('goById');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      await component.updateFormBtnClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(EditRequirementModalEnum.SuccessModal);
    });

    it('should switch to error modal when operation is failed', async () => {
      // Arrange
      facade.updateRequirement = jasmine.createSpy('updateRequirement').and.throwError(new Error());
      switcher.goById = jasmine.createSpy('goById');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.updateFormBtnClick();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(EditRequirementModalEnum.ErrorModal);
    });

    it('should call updateFormBtnClick when submit btn is pressed', async () => {
      // Arrange
      component.updateFormBtnClick = jasmine.createSpy('updateFormBtnClick');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      await fixture.whenRenderingDone();

      fixture.debugElement.query(By.css('#submit-form-btn')).triggerEventHandler('click', {});

      // Assert
      expect(component.updateFormBtnClick).toHaveBeenCalled();
    });
  });
});
