import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuditorListComponent } from './auditor-list.component';
import { configureTestSuite } from 'ng-bullet';

describe('AuditorListComponent', () => {
    configureTestSuite();
    let fixture: ComponentFixture<AuditorListComponent>;
    let component: AuditorListComponent;

    const mockAuditors = [{ first_name: 'bla', last_name: 'blo' }, { first_name: 'bla2', last_name: 'blo2' }];

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
            ],
            declarations: [AuditorListComponent],
        });

        fixture = TestBed.createComponent(AuditorListComponent);
        component = fixture.componentInstance;
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('getAuditorsToDisplay', () => {
        it('should set auditorsToDisplay to auditor list when there are less than 4 auditors', () => {
            // Arrange
            component.auditors = mockAuditors;

            // Act
            component.getAuditorsToDisplay();

            // Assert
             expect(component.auditorsToDisplay).toEqual(mockAuditors);
        });

        it('should set auditorsToDisplay and moreAuditors to the correct values when there are more than 4 auditors', () => {
            // Arrange
            const otherAuditors = [{ first_name: 'other1', last_name: 'blo' }, { first_name: 'other2', last_name: 'blo2' }];
            component.auditors = [...mockAuditors, ...mockAuditors, ...otherAuditors];

            // Act
            component.getAuditorsToDisplay();

            // Assert
             expect(component.auditorsToDisplay.length).toEqual(4);
             expect(component.moreAuditors).toEqual(['other1 blo', 'other2 blo2']);
        });
    });
});
