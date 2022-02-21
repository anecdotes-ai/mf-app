import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlViewItemComponent } from './control-view-item.component';
import { ControlsFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ControlViewItemComponent', () => {
  let component: ControlViewItemComponent;
  let fixture: ComponentFixture<ControlViewItemComponent>;

  let controlFacade: ControlsFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlViewItemComponent],
      providers: [{ provide: ControlsFacadeService, useValue: {} }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlViewItemComponent);
    component = fixture.componentInstance;

    controlFacade = TestBed.inject(ControlsFacadeService);
    controlFacade.getSingleControlOrSnapshot = jasmine.createSpy('getSingleControlOrSnapshot').and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
