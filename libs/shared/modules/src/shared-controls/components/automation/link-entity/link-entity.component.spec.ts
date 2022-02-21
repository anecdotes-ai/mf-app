import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherModule } from 'core/modules/component-switcher/component-switcher.module';
import { of } from 'rxjs';

import { LinkEntityComponent } from './link-entity.component';
import {ComponentSwitcherDirective} from 'core/modules/component-switcher';

describe('LinkEntityComponent', () => {
  let component: LinkEntityComponent<any>;
  let fixture: ComponentFixture<LinkEntityComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ComponentSwitcherModule, TranslateModule.forRoot() ],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} }],
      declarations: [ LinkEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkEntityComponent);
    component = fixture.componentInstance;
    component.translationRootKey = '';
    component.entities = of([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
