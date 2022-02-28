import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'core/services/config/app.config.service';
import { AbstractService } from '../abstract-http/abstract-service';
import { User } from '../../../models/domain';

@Injectable()
export class UserService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.buildUrl((a) => a.getUser));
  }

  updateUser(user_email: string): Observable<any> {
    return this.http.put(
      this.buildUrl((t) => t.updateUser, { user_email }),
      user_email
    );
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(
      this.buildUrl((t) => t.addUser),
      user
    );
  }

  removeSpecificUser(userEmail: string): Observable<any> {
    return this.http.delete<any>(this.buildUrl((a) => a.deleteUser, { user_email: userEmail }));
  }
}
