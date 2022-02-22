import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FrameworkCategories } from './framework-categories.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesFacadeService } from 'core/modules/data/services';
import { TranslateModule } from '@ngx-translate/core';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('FrameworkCategories', () => {
    let fixture: ComponentFixture<FrameworkCategories>;
    let component: FrameworkCategories;

    let categoriesFacade: CategoriesFacadeService;

    const mockFramework = { framework_id: '1234', framework_name: 'name' };
    const mockCategories = [];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: CategoriesFacadeService, useValue: {} },
            ],
            declarations: [FrameworkCategories],
        });

        fixture = TestBed.createComponent(FrameworkCategories);
        component = fixture.componentInstance;
        categoriesFacade = TestBed.inject(CategoriesFacadeService);
        categoriesFacade.getFrameworkCategories =
            jasmine.createSpy('getFrameworkCategories')
                .and.returnValue(of(mockCategories));
        component.framework = mockFramework;
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnInit', () => {
        it('should call getFrameworkCategories', () => {
            // Arrange
            // Act
            fixture.detectChanges();

            // Assert
            expect(categoriesFacade.getFrameworkCategories).toHaveBeenCalled();
        });

        it('should set framework categories with correct value', async () => {
            // Act
            fixture.detectChanges();

            // Assert
            expect(await component.categories$.pipe(take(1)).toPromise()).toBe(mockCategories);
        });
    });
});
