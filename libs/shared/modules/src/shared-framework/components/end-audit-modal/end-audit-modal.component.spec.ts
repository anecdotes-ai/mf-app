import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { Subject } from 'rxjs';
import { EndAuditModal, EndAuditModalEnum } from './end-audit-modal.component';
import { Router } from '@angular/router';

class MockSwitcherDir {
    public sharedContext$ = new Subject<{ framework: Framework }>();

    goById = jasmine.createSpy('goById');
}

describe('EndAuditModal', () => {
    configureTestSuite();
    let fixture: ComponentFixture<EndAuditModal>;
    let component: EndAuditModal;

    let frameworksFacadeService: FrameworksFacadeService;
    let switcher: MockSwitcherDir;

    const mockFramework = { framework_id: '111', framework_name: 'name', framework_current_audit: {} };

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: FrameworksFacadeService, useValue: {} },
                { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
                { provide: Router, useValue: {} }
            ],
            declarations: [EndAuditModal],
        });

        switcher = TestBed.inject(ComponentSwitcherDirective) as any;

        frameworksFacadeService = TestBed.inject(FrameworksFacadeService);
        frameworksFacadeService.endFrameworkAudit = jasmine.createSpy('endFrameworkAudit');

        fixture = TestBed.createComponent(EndAuditModal);
        component = fixture.componentInstance;
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('endAudit', () => {
        beforeAll(() => {
            component.onAuditEnded = jasmine.createSpy('onAuditEnded');
          });

        it('should call endFrameworkAudit with framework id', async () => {
            // Arrange
            component.framework = mockFramework;

            // Act
            await component.endAudit();

            // Assert
            expect(frameworksFacadeService.endFrameworkAudit).toHaveBeenCalledWith(mockFramework);
        });

        it('should call goById with success value', async () => {
            // Arrange
            component.framework = mockFramework;

            // Act
            await component.endAudit();

            // Assert
            expect(frameworksFacadeService.endFrameworkAudit).toHaveBeenCalledWith(mockFramework);
            expect(switcher.goById).toHaveBeenCalledWith(EndAuditModalEnum.Success);
        });

        it('should call goById with error value', async () => {
              // Arrange
              component.framework = mockFramework;
              frameworksFacadeService.endFrameworkAudit = jasmine.createSpy('endFrameworkAudit').and.throwError(new Error());

              // Act
              await component.endAudit();

              // Assert
              expect(switcher.goById).toHaveBeenCalledWith(EndAuditModalEnum.Error);
        });
    });
});
