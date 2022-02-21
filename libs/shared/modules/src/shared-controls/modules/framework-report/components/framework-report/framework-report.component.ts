import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, CustomerFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { CalculatedControl } from 'core/modules/data/models';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-framework-report',
  templateUrl: './framework-report.component.html',
  styleUrls: ['./framework-report.component.scss'],
})
export class FrameworkReportComponent implements OnInit {
  framework_id: string;

  customer$: Observable<Customer>;
  framework$: Observable<Framework>;
  controls$: Observable<CalculatedControl[]>;

  constructor(
    private route: ActivatedRoute,
    private customerFacade: CustomerFacadeService,
    private frameworksFacade: FrameworksFacadeService,
    private controlsFacade: ControlsFacadeService
  ) {}

  ngOnInit(): void {
    this.framework_id = this.route.snapshot.queryParams.framework_id;

    this.customer$ = this.customerFacade.getCurrentCustomer();
    this.framework$ = this.frameworksFacade.getFrameworkById(this.framework_id);
    this.controls$ = this.controlsFacade.getControlsByFrameworkId(this.framework_id).pipe(
      filter((controls) => !!controls),
      map((controls) => controls.filter((control) => control.control_is_applicable))
    );
  }
}
