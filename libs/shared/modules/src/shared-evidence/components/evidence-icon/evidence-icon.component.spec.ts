import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SvgRegistryService } from 'core/modules/svg-icons';
import { EvidenceIconComponent } from './evidence-icon.component';

describe('EvidenceIconComponent', () => {
  let component: EvidenceIconComponent;
  let fixture: ComponentFixture<EvidenceIconComponent>;
  let svgRegistryServiceMock: SvgRegistryService;

  let iconExists: boolean;
  const fakeServiceId = 'fakeserviceid';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceIconComponent],
      providers: [{ provide: SvgRegistryService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceIconComponent);
    component = fixture.componentInstance;
    svgRegistryServiceMock = TestBed.inject(SvgRegistryService);
    svgRegistryServiceMock.doesIconExist = jasmine.createSpy('doesIconExist').and.callFake(() => !!iconExists);
    component.evidenceServiceId = fakeServiceId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('iconSrc', () => {
    it('should call doesIconExist with composed icon path', () => {
      // Arrange
      // Act
      const _ = component.iconSrc;

      // Assert
      expect(svgRegistryServiceMock.doesIconExist).toHaveBeenCalledWith(`plugins/${fakeServiceId}`);
    });

    it('should return icon src based on service id if icon exist', () => {
      // Arrange
      iconExists = true;

      // Act
      // Assert
      expect(component.iconSrc).toBe(`plugins/${fakeServiceId}`);
    });

    it('should return default icon', () => {
      // Arrange
      iconExists = false;

      // Act
      // Assert
      expect(component.iconSrc).toBe('evidences/default');
    });
  });
});
