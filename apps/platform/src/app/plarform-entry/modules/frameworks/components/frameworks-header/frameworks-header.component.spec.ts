import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrameworksHeaderComponent } from './frameworks-header.component';
import { FrameworkModalService } from 'core/modules/shared-framework/services';
import { RoleService } from 'core/modules/auth-core/services';
import { FrameworkContentService } from '../../services';

describe('FrameworksHeaderComponent', () => {
  let component: FrameworksHeaderComponent;
  let fixture: ComponentFixture<FrameworksHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrameworksHeaderComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore(),
        { provide: FrameworkContentService, useValue: {} },
        { provide: FrameworkModalService, useValue: {} },
        { provide: RoleService, useValue: {} }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworksHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
