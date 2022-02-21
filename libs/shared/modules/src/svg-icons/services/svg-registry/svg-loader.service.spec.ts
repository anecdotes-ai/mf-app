import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SvgLoaderService } from '../svg-loader/svg-loader.service';
import { SvgRegistryService } from './svg-registry.service';

const fakeIconsSprite = `
  <svg>
    <svg id="first"></svg>
    <svg id="second"></svg>
    <svg id="folder--third"></svg>
    <svg id="folder--fourth"></svg>
    <svg id="folder--subfolder--fives"></svg>
  </svg>
`.trim();

const div = document.createElement('div');
div.innerHTML = fakeIconsSprite;
const spriteSvgElement = div.querySelector('svg');

const existingSvgIcons: { id: string; relativePath: string }[] = Array.from(
  spriteSvgElement.querySelectorAll('svg')
).map((svgElement: SVGSVGElement) => ({ id: svgElement.id, relativePath: svgElement.id.split('--').join('/') }));

describe('SvgRegistryService', () => {
  let serviceUnderTest: SvgRegistryService;

  let loaderMock: SvgLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SvgRegistryService, { provide: SvgLoaderService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(SvgRegistryService);
    loaderMock = TestBed.inject(SvgLoaderService);
    loaderMock.getSprite = jasmine.createSpy('getSprite').and.callFake(() => of(fakeIconsSprite));
  });

  it('should be able to create service instance', () => {
    expect(serviceUnderTest).toBeDefined();
  });

  describe('initAsync function', () => {
    it('should call getSprite', async () => {
      // Arrange
      // Act
      await serviceUnderTest.initAsync();

      // Assert
      expect(loaderMock.getSprite).toHaveBeenCalledWith();
    });
  });

  describe('service is initialized', () => {
    beforeEach(() => serviceUnderTest.initAsync());

    describe('getRequiredSvgElement function', () => {
      existingSvgIcons.forEach((iconRelativePathTestCase) => {
        it(`should return svg element for "${iconRelativePathTestCase.relativePath}" relative path`, () => {
          // Arrange
          // Act
          const actualSvg = serviceUnderTest.getRequiredSvgElement(iconRelativePathTestCase.relativePath);

          // Assert
          expect(actualSvg.tagName).toBe('svg');
          expect(actualSvg.id).toBe(iconRelativePathTestCase.id);
        });
      });

      it('should throw error for not exisiting relative path', () => {
        // Arrange
        const invalidRelativePath = 'not/existing/one';

        // Act
        try {
          serviceUnderTest.getRequiredSvgElement(invalidRelativePath);
          fail('error is not thrown');
        } catch (error) {
          // Assert
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain(invalidRelativePath);
        }
      });
    });

    describe('getSvgElement function', () => {
      existingSvgIcons.forEach((iconRelativePathTestCase) => {
        it(`should return svg element for "${iconRelativePathTestCase.relativePath}" relative path`, () => {
          // Arrange
          // Act
          const actualSvg = serviceUnderTest.getSvgElement(iconRelativePathTestCase.relativePath);

          // Assert
          expect(actualSvg.tagName).toBe('svg');
          expect(actualSvg.id).toBe(iconRelativePathTestCase.id);
        });
      });

      it('should return null for not exisiting relative path', () => {
        // Arrange
        const invalidRelativePath = 'not/existing/one';

        // Act
        const actualSvg = serviceUnderTest.getSvgElement(invalidRelativePath);

        // Assert
        expect(actualSvg).toBeNull();
      });
    });

    describe('doesIconExist function', () => {
      existingSvgIcons.forEach((iconRelativePathTestCase) => {
        it(`should return true for "${iconRelativePathTestCase.relativePath}" relative path`, () => {
          // Arrange
          // Act
          const actual = serviceUnderTest.doesIconExist(iconRelativePathTestCase.relativePath);

          // Assert
          expect(actual).toBeTrue();
        });
      });

      it('should return false for not exisiting relative path', () => {
        // Arrange
        const invalidRelativePath = 'not/existing/one';

        // Act
        const actual = serviceUnderTest.doesIconExist(invalidRelativePath);

        // Assert
        expect(actual).toBeFalse();
      });
    });

    describe('getAllIconRelativePaths', () => {
      it('should return relative paths of all existing icons', () => {
        // Arrange
        // Act
        const actualRelativePaths = serviceUnderTest.getAllIconRelativePaths();

        // Assert
        expect(actualRelativePaths.length).toBe(existingSvgIcons.length);
        existingSvgIcons.forEach((testCase) => {
          expect(actualRelativePaths).toContain(testCase.relativePath);
        });
      });
    });
  });

  describe('getSvgElementString function', () => {
    existingSvgIcons.forEach((iconRelativePathTestCase) => {
      it(`should return svg element string representation for "${iconRelativePathTestCase.relativePath}" relative path`, () => {
        // Arrange
        // Act
        const actualSvgStringRepresentation = serviceUnderTest.getSvgElementString(
          iconRelativePathTestCase.relativePath
        );

        // Assert
        expect(spriteSvgElement.querySelector(`svg#${iconRelativePathTestCase.id}`).outerHTML).toBe(
          actualSvgStringRepresentation
        );
      });
    });

    it('should return null for not exisiting relative path.', () => {
      // Arrange
      const invalidRelativePath = 'not/existing/one';

      // Act
      const actualSvgStringRepresentation = serviceUnderTest.getSvgElementString(invalidRelativePath);

      // Assert
      expect(actualSvgStringRepresentation).toBeNull();
    });
  });
});
