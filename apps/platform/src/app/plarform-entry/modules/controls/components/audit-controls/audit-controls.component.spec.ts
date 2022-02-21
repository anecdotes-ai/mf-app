import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditControlsComponent } from './audit-controls.component';
import { FrameworksFacadeService, SnapshotsFacadeService } from 'core/modules/data/services';
import { LoaderManagerService } from 'core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

describe('AuditControlsComponent', () => {
  configureTestSuite();

  const snapshotId = '123';
  const mockFramework = { framework_id: '1234', framework_name: 'name' };
  let component: AuditControlsComponent;
  let fixture: ComponentFixture<AuditControlsComponent>;
  let frameworksFacade: FrameworksFacadeService;
  let loaderManagerServiceMock: LoaderManagerService;
  let snapshotsFacadeService: SnapshotsFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditControlsComponent ],
      providers: [
        { provide: SnapshotsFacadeService, useValue: {} },
        { provide: LoaderManagerService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ framework: mockFramework.framework_name, snapshot: snapshotId }) } },
        },
      ]
    })
    .compileComponents();
    loaderManagerServiceMock = TestBed.inject(LoaderManagerService);
    loaderManagerServiceMock.show = jasmine.createSpy('show');
    loaderManagerServiceMock.hide = jasmine.createSpy('hide');
    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getFrameworkByName = jasmine.createSpy('getFrameworkByName').and.returnValue(of(mockFramework));
    snapshotsFacadeService = TestBed.inject(SnapshotsFacadeService);
    snapshotsFacadeService.getFramewrokSnapshot = jasmine.createSpy('getFramewrokSnapshot').and.returnValue(of(mockFramework));

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
