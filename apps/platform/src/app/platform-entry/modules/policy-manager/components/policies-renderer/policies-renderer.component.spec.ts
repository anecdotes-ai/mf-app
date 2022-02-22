import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Policy } from 'core/modules/data/models/domain';
import { PoliciesRendererComponent } from './policies-renderer.component';

describe('PoliciesRendererComponent', () => {
  let component: PoliciesRendererComponent<Policy>;
  let fixture: ComponentFixture<PoliciesRendererComponent<Policy>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoliciesRendererComponent],
      imports: [ TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciesRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
