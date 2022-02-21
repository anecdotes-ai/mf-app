import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataFilterManagerService } from '../../services';
import { DataFilterButtonComponent } from './data-filter-button.component';

describe('DataFilterButtonComponent', () => {
  let component: DataFilterButtonComponent;
  let fixture: ComponentFixture<DataFilterButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFilterButtonComponent ],
      providers: [{ provide: DataFilterManagerService, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
