/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { FrameworkMenuComponent } from './framework-menu.component';
import {FrameworksPluginsModalService} from "core/modules/shared-controls/modules/frameworks-plugins/services/frameworks-plugins-modal/frameworks-plugins-modal.service";

describe('FrameworkMenuComponent', () => {
  let component: FrameworkMenuComponent;
  let fixture: ComponentFixture<FrameworkMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameworkMenuComponent ],
      providers: [
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: FrameworksPluginsModalService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
