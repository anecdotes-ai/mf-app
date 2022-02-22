import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService, WindowHelperService } from 'core';
import { AuthService } from 'core/modules/auth-core/services';

@Component({
  selector: 'app-token-callback',
  templateUrl: './token-callback.component.html',
  styleUrls: ['./token-callback.component.scss']
})
export class TokenCallbackComponent implements OnInit {

  constructor(private authService: AuthService,
    private windowHelper: WindowHelperService,
    private route: ActivatedRoute,
    private logger: LoggerService) { }

  ngOnInit(): void {
    this.init();
  }

  async init(): Promise<void> {
    try {
      const token = this.route.snapshot.queryParamMap.get('token');
      const tenant = this.route.snapshot.queryParamMap.get('tenantSubDomain');
      if (token) {
        await this.authService.signInWithTokenAsync(token, tenant);
      }
    } catch (error) {
      this.logger.error(error);
    }
    this.windowHelper.redirectToOrigin();
  }

}
