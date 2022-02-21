import { Component, OnInit, Input } from '@angular/core';
import { Service } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { Permissions, PermissionsService } from 'core';

@Component({
  selector: 'app-plugin-permissions-tab',
  templateUrl: './plugin-permissions-tab.component.html',
  styleUrls: ['./plugin-permissions-tab.component.scss'],
})
export class PluginPermissionsTabComponent implements OnInit {
  @Input()
  service: Service;

  permissions$: Observable<Permissions>;

  constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.permissions$ = this.permissionsService.getPermissions(this.service.service_id);
  }
}
