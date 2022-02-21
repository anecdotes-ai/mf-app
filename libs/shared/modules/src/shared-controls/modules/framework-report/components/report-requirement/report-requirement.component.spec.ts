import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportRequirementComponent } from './report-requirement.component';
import { configureTestSuite } from 'ng-bullet';
import { PluginService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

describe('ReportRequirementComponent', () => {
  configureTestSuite();

  let component: ReportRequirementComponent;
  let fixture: ComponentFixture<ReportRequirementComponent>;

  let pluginService: PluginService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportRequirementComponent],
      providers: [{ provide: PluginService, useValue: {} }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRequirementComponent);
    component = fixture.componentInstance;

    component.requirement = {
      requirement_related_evidences: [{ service_id: 'id1' }, { service_id: 'id2' }],
    };

    pluginService = TestBed.inject(PluginService);
    pluginService.getServiceIconLink = jasmine.createSpy('getServiceIconLink').and.returnValue(of('icon1'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('pluginIcons should return an array of icons paths', async () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    expect(await component.pluginsIcons.pipe(take(1)).toPromise()).toEqual(['icon1']);
  });

  it('should return appropriate translation key', async () => {
    // Arrange
    const key = 'key';
    const parentKey = 'frameworkReport.reportRequirement.';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${parentKey}${key}`);
  });
});
