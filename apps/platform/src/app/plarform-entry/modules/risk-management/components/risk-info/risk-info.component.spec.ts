/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RiskFacadeService } from 'core/modules/risk/services';
import { RiskInfoComponent } from './risk-info.component';

describe('RiskInfoComponent', () => {
  let component: RiskInfoComponent;
  let fixture: ComponentFixture<RiskInfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskInfoComponent],
        providers: [{ provide: RiskFacadeService, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
