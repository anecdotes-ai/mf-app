// import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { Injectable } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { AppConfigService } from 'core';
// import { AuthService } from 'core/modules/auth-core/services';
// import { TokenInterceptorService } from './token-interceptor.service';

// @Injectable()
// export class TestService {
//   ROOT_URL = `some-url`;

//   constructor(private http: HttpClient) { }

//   getSomething(): Promise<any> {
//     return this.http.get(`${this.ROOT_URL}/something`).toPromise();
//   }
// }

// describe(`TokenInterceptorService`, () => {
//   let service: TestService;
//   let httpMock: HttpTestingController;
//   let appConfigService: AppConfigService;
//   let authServiceMock: AuthService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         TestService,
//         {
//           provide: AuthService,
//           useValue: {},
//         },
//         {
//           provide: HTTP_INTERCEPTORS,
//           useClass: TokenInterceptorService,
//           multi: true,
//         },
//         { provide: AppConfigService, useValue: { config: { api: { useAuth: false } } } },
//       ],
//     });

//     service = TestBed.inject(TestService);
//     httpMock = TestBed.inject(HttpTestingController);
//     appConfigService = TestBed.inject(AppConfigService);
//     authServiceMock = TestBed.inject(AuthService);
//     authServiceMock.getAccessTokenAsync = jasmine.createSpy('getAccessTokenAsync').and.callFake(() => Promise.resolve("token"));
//     authServiceMock.signOutAsync = jasmine.createSpy('signOutAsync').and.callFake(() => Promise.resolve());
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   describe('#useAuth', () => {
//     fit('should add Authorization header if config.api.useAuth === true', async () => {
//       // Arrange
//       appConfigService.config.api.useAuth = true;

//       // Act

//       // Assert
//       const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/something`);
//       await service.getSomething();

//       expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
//       expect(httpRequest.request.headers.get('Authorization')).toEqual('Bearer some-token');
//     });

//     it('should not add Authorization header if config.api.useAuth === false', async () => {
//       // Arrange
//       appConfigService.config.api.useAuth = false;

//       // Act
//       await service.getSomething();

//       // Assert
//       const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/something`);
//       expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
//     });

//     it('should call signInWithRedirect if config.api.useAuth === true and request ended with error 401', async () => {
//       // Arrange
//       appConfigService.config.api.useAuth = true;

//       // Act
//       await service.getSomething();

//       // Assert
//       const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/something`);
//       httpRequest.flush(
//         {},
//         {
//           status: 401,
//           statusText: 'Unauthorized',
//         }
//       );
//       expect(authServiceMock.signOutAsync).toHaveBeenCalled();
//     });
//   });
// });


// Tests need to be rewritten
