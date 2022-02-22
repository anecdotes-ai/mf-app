import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrameworkAuditHistory } from './framework-audit-history.component';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('FrameworkAuditHistory', () => {
  let fixture: ComponentFixture<FrameworkAuditHistory>;
  let component: FrameworkAuditHistory;

  let frameworksFacade: FrameworksFacadeService;
  const mockFramework = { framework_id: '1234', framework_name: 'name' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
      ],
      declarations: [FrameworkAuditHistory],
    });

    fixture = TestBed.createComponent(FrameworkAuditHistory);
    component = fixture.componentInstance;

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getFrameworkByName = jasmine
      .createSpy('getFrameworkByName')
      .and.returnValue(of(mockFramework));
    frameworksFacade.getFrameworkAuditHistory = jasmine.createSpy('getFrameworkAuditHistory').and.returnValue(of([]));
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call getFrameworkByName', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(frameworksFacade.getFrameworkByName).toHaveBeenCalled();
    });

    it('should call getFrameworkAuditHistory', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(frameworksFacade.getFrameworkAuditHistory).toHaveBeenCalledWith(mockFramework.framework_id);
    });
  });
});
