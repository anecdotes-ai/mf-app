import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginInfoEvidenceComponent } from './plugin-info-evidence.component';

describe('PluginInfoEvidenceComponent', () => {
  let component: PluginInfoEvidenceComponent;
  let fixture: ComponentFixture<PluginInfoEvidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginInfoEvidenceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginInfoEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
