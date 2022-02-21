import { Service } from 'core/modules/data/models/domain';
import { PluginFacadeService } from 'core/modules/data/services';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritePluginStarButtonComponent } from './favorite-plugin-star-button.component';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { CoreModule } from 'core';
import { Router } from '@angular/router';

describe('FavoritePluginStarButtonComponent', () => {
  configureTestSuite();

  let component: FavoritePluginStarButtonComponent;
  let fixture: ComponentFixture<FavoritePluginStarButtonComponent>;
  let pluginFacadeService: PluginFacadeService;

  let fakePlugin: Service;
  const fakePluginId = 'fake_id';

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritePluginStarButtonComponent],
      providers: [
        { provide: PluginFacadeService, useValue: {} },
        { provide: Router, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePluginStarButtonComponent);
    pluginFacadeService = TestBed.inject(PluginFacadeService);
    component = fixture.componentInstance;
    pluginFacadeService.getServiceById = jasmine.createSpy('getServiceById').and.callFake(() => of(fakePlugin));
    pluginFacadeService.addPluginToFavorites = jasmine.createSpy('addPluginToFavourites');
    pluginFacadeService.removePluginFromFavorites = jasmine.createSpy('removePluginFromFavourites');
    component.pluginId = fakePluginId;
    fakePlugin = { service_id: 'gcp', service_families: ['secondServiceFamily'], service_is_favorite: true};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have 'role' attribute set to 'button'`, async () => {
    // Arrange
    // Act
    await detectChanges();

    // Assert
    expect(fixture.debugElement.attributes['role']).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getServiceById with pluginId', async () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(pluginFacadeService.getServiceById).toHaveBeenCalledWith(fakePluginId);
    });

    it('should assign plugin.service_is_favorite to isPluginFavourite', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.isPluginFavorite).toEqual(true);
    });
  });

  describe('click on host', () => {
    describe('plugin is favourite', () => {
      it('should call removePluginFromFavourites', async () => {
        // Arrange
        fakePlugin.service_is_favorite = true;
        const clickEvent = new MouseEvent('click');

        // Act
        await detectChanges();
        fixture.debugElement.triggerEventHandler('click', clickEvent);

        // Assert
        expect(pluginFacadeService.removePluginFromFavorites).toHaveBeenCalledWith(fakePluginId);
      });
    });

    describe('plugin is not favourite', () => {
      it('should call addPluginToFavourites', async () => {
        // Arrange
        fakePlugin.service_is_favorite = false;
        const clickEvent = new MouseEvent('click');

        // Act
        await detectChanges();
        fixture.debugElement.triggerEventHandler('click', clickEvent);

        // Assert
        expect(pluginFacadeService.addPluginToFavorites).toHaveBeenCalledWith(fakePluginId);
      });
    });
  });

  describe('mousedown on focus', () => {
    it(`should call event.stopPropagation method when mousedown event happens`, async () => {
      // Arrange
      const clickEvent = new MouseEvent('mousedown');
      clickEvent.stopPropagation = jasmine.createSpy('stopPropagation');

      // Act
      await detectChanges();
      fixture.debugElement.triggerEventHandler('mousedown', clickEvent);

      // Assert
      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
  });
});
