import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworksPluginsListItemComponent } from './frameworks-plugins-list-item.component';
import { configureTestSuite } from 'ng-bullet';
import { TranslateModule } from '@ngx-translate/core';

describe('FrameworksPluginsListItemComponent', () => {
  configureTestSuite();
  let component: FrameworksPluginsListItemComponent;
  let fixture: ComponentFixture<FrameworksPluginsListItemComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrameworksPluginsListItemComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(FrameworksPluginsListItemComponent);
    component = fixture.componentInstance;
  });
});
