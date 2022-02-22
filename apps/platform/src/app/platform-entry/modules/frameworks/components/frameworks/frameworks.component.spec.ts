import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FrameworksComponent } from './frameworks.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { LoaderManagerService } from 'core';
import { Router } from '@angular/router';
import { FrameworkContentService } from '../../services';

describe('FrameworksComponent', () => {
  let fixture: ComponentFixture<FrameworksComponent>;
  let component: FrameworksComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LoaderManagerService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: FrameworkContentService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
      declarations: [FrameworksComponent],
    });

    fixture = TestBed.createComponent(FrameworksComponent);
    component = fixture.componentInstance;
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });
});
