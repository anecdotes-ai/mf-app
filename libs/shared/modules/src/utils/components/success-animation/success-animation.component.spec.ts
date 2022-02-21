/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessAnimationComponent } from './success-animation.component';
import { HttpClientModule } from '@angular/common/http';

describe('SuccessAnimationComponent', () => {
  let component: SuccessAnimationComponent;
  let fixture: ComponentFixture<SuccessAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [SuccessAnimationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
