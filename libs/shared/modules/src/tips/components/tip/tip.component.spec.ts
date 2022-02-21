import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TipTypeEnum, WindowHelperService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { TipComponent } from './tip.component';
import { By } from '@angular/platform-browser';

class LocalStorage {
  storage = {};

  setItem(key: string, value: string): void {
    this.storage[key] = value || '';
  }

  getItem(key: string): string {
    return key in this.storage ? this.storage[key] : null;
  }
}

describe('TipComponent', () => {
  configureTestSuite();

  let component: TipComponent;
  let fixture: ComponentFixture<TipComponent>;
  let windowHelper: WindowHelperService;
  let localStorage: LocalStorage;

  const tipId = 'some-id';

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: WindowHelperService, useValue: {} }],
      declarations: [TipComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipComponent);
    component = fixture.componentInstance;

    localStorage = new LocalStorage();

    windowHelper = TestBed.inject(WindowHelperService);
    windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue({ localStorage });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('class bindings', () => {
    it('should set hidden class to host if passed tip id is present in localStorage', () => {
      // Arrange
      const tipId = 'some-id';
      component.tipId = tipId;
      localStorage.setItem('hidden-tips', JSON.stringify([tipId]));

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['hidden']).toBeTruthy();
    });

    it('should NOT set hidden class to host if passed tip id is NOT present in localStorage', () => {
      // Arrange
      const tipId = 'some-id';
      component.tipId = tipId;
      localStorage.setItem('hidden-tips', JSON.stringify(['some-another-id']));

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['hidden']).toBeFalsy();
    });

    it('should set tip class to host if passed tip type is TIP', () => {
      // Arrange
      component.tipType = TipTypeEnum.TIP;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['tip']).toBeTruthy();
    });

    it('should set notice class to host if passed tip type is NOTICE', () => {
      // Arrange
      component.tipType = TipTypeEnum.NOTICE;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['notice']).toBeTruthy();
    });

    it('should set error class to host if passed tip type is ERROR', () => {
      // Arrange
      component.tipType = TipTypeEnum.ERROR;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['error']).toBeTruthy();
    });
  });

  describe('#icon', () => {
    it('should return tip if passed tip type is TIP', () => {
      // Arrange
      component.tipType = TipTypeEnum.TIP;

      // Act
      const result = component.icon;

      // Assert
      expect(result).toBe('tip');
    });

    it('should return tip_notice if passed tip type is NOTICE', () => {
      // Arrange
      component.tipType = TipTypeEnum.NOTICE;

      // Act
      const result = component.icon;

      // Assert
      expect(result).toBe('tip_notice');
    });

    it('should return tip_error if passed tip type is ERROR', () => {
      // Arrange
      component.tipType = TipTypeEnum.ERROR;

      // Act
      const result = component.icon;

      // Assert
      expect(result).toBe('tip_error');
    });
  });

  describe('#closeTip', () => {
    it('should display close button if "permanent" property === false', () => {
      // Arrange
      component.tipId = tipId;
      component.permanent = false;
      fixture.detectChanges();
      // Act
      const closeButton = fixture.debugElement.query(By.css('#close-icon')).nativeElement;

      // Assert
      expect(closeButton).toBeTruthy();
    });

    it('should not display close button if "permanent" property === true', () => {
      // Arrange
      component.tipId = tipId;
      component.permanent = true;
      fixture.detectChanges();
      // Act
      const closeButton = fixture.debugElement.query(By.css('#close-icon'));

      // Assert
      expect(closeButton).toBeFalsy();
    });

    it('should add tip id to local storage', () => {
      // Arrange
      component.tipId = tipId;

      // Act
      component.closeTip();

      // Assert
      expect(JSON.parse(localStorage.getItem('hidden-tips'))).toContain(tipId);
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`core.tip.${relativeKey}`);
    });
  });
});
