import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginLabelComponent } from './plugin-label.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PluginLabelComponent', () => {
  let component: PluginLabelComponent;
  let fixture: ComponentFixture<PluginLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ PluginLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
