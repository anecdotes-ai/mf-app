// import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
// import { ServicesState } from 'core/modules/data/store/reducers';
// import { TestBed } from '@angular/core/testing';
// import { StoreModule } from '@ngrx/store';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';
// import { reducers } from 'core/modules/data/store/state';
// import { PluginFacadeService } from './plugin-facade.service';
// import { every, take } from 'rxjs/operators';
// import { ServiceLogsAdded } from 'core/modules/data/store/actions/services.actions';
// import { of, pipe } from 'rxjs';
// import { act } from '@ngrx/effects';

// describe('Service: PluginFacade', () => {
//   let service: PluginFacadeService;
//   let mockStore: MockStore;

//   const mockServices: Service[] = [
//     {
//       service_id: 'first_service_id',
//     },
//     {
//       service_id: 'second_service_id',
//     },
//   ];

//   const servicesState: ServicesState = {
//     initialized: true,
//     ids: mockServices.map((s) => s.service_id),
//     entities: {
//       [mockServices[0].service_id]: { serviceLogs: [{ message: 'testOne' }], service: mockServices[0] },
//       [mockServices[1].service_id]: { serviceLogs: undefined, service: mockServices[1] },
//     },
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [provideMockStore(), PluginFacadeService],
//       imports: [StoreModule.forRoot(reducers)],
//     });

//     service = TestBed.inject(PluginFacadeService);
//     mockStore = TestBed.inject(MockStore);

//     mockStore.setState({
//       servicesState,
//     });
//   });

//   it('should ...', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('getAllServices', () => {
//     it('should return all services', async () => {
//       // Arrange
//       // Act
//       const res = await service.getAllServices().pipe(take(1)).toPromise();

//       // Assert
//       expect(res).toEqual(mockServices);
//     });
//   });

//   describe('getServiceById', () => {
//     it('should return service by service_id', async () => {
//       // Arrange
//       // Act
//       const res = await service.getServiceById(mockServices[0].service_id).pipe(take(1)).toPromise();

//       // Assert
//       expect(res).toEqual(mockServices[0]);
//     });
//   });

//   describe('areLogsLoadedForPlugin', () => {
//     it('should return boolean value that represents whether serviceLog exists for service or not', async () => {
//       // Arrange
//       // Act
//       const firstResult = await service.areLogsLoadedForPlugin(mockServices[0].service_id).pipe(take(1)).toPromise();

//       // Assert
//       expect(firstResult).toBeTrue();

//       // Act
//       const secondResult = await service.areLogsLoadedForPlugin(mockServices[1].service_id).pipe(take(1)).toPromise();

//       // Assert
//       expect(secondResult).toBeFalsy();
//     });
//   });

//   describe('getLogs', () => {
//     it('should return logs with specified filter', async () => {
//       // Arrange
//       const filterByMessageValue = 'Test one';
//       const testedServiceLog = { message: filterByMessageValue, run_id: '12345' };
//       servicesState.entities[mockServices[0].service_id].serviceLogs = [testedServiceLog];

//       mockStore.setState({
//         servicesState,
//       });

//       // Act
//       const result = await service
//         .getLogs(mockServices[0].service_id, (s) => s.message === filterByMessageValue)
//         .pipe(take(1))
//         .toPromise();

//       // Assert
//       expect(result.length).toEqual(1);
//       expect(result[0]).toBe(testedServiceLog);
//     });
//   });

//   describe('getLogsOrderedByDate', () => {
//     const firstTestedServiceLog = { message: 'first', run_id: '12345', timestamp: 1 };
//     const secondTestedServiceLog = { message: 'second', run_id: '123456', timestamp: 5 };
//     const thirdTestedServiceLog = { message: 'third', run_id: '1234567', timestamp: 10 };
//     const fourthTestedServiceLog = { message: 'fourth', run_id: '12345678', timestamp: 15 };

//     it('should return sorted logs by date with ascending by default', async () => {
//       // Arrange

//       servicesState.entities[mockServices[0].service_id].serviceLogs = [
//         fourthTestedServiceLog,
//         secondTestedServiceLog,
//         firstTestedServiceLog,
//         thirdTestedServiceLog,
//       ];

//       mockStore.setState({
//         servicesState,
//       });

//       // Act
//       const result = await service.getLogsOrderedByDate(mockServices[0].service_id).pipe(take(1)).toPromise();

//       // Assert
//       expect(result).toEqual([
//         firstTestedServiceLog,
//         secondTestedServiceLog,
//         thirdTestedServiceLog,
//         fourthTestedServiceLog,
//       ]);
//     });

//     it('should return sorted and filtered logs by date with descending', async () => {
//       // Arrange
//       servicesState.entities[mockServices[0].service_id].serviceLogs = [
//         fourthTestedServiceLog,
//         secondTestedServiceLog,
//         firstTestedServiceLog,
//         thirdTestedServiceLog,
//       ];

//       mockStore.setState({
//         servicesState,
//       });

//       // Act
//       const result = await service
//         .getLogsOrderedByDate(mockServices[0].service_id, (s) => s.timestamp < 11, 'dsc')
//         .pipe(take(1))
//         .toPromise();

//       // Assert
//       expect(result).toEqual([thirdTestedServiceLog, secondTestedServiceLog, firstTestedServiceLog]);
//     });
//   });

//   describe('addPluginLogs', () => {
//     it('should dispatch ServiceLogsAdded method', () => {
//       // Arrange
//       mockStore.dispatch = jasmine.createSpy('dispatch');
//       const logsToAdd = [{ message: 'first', run_id: '12345', timestamp: 1 }];

//       // Act
//       service.addPluginLogs(mockServices[0].service_id, logsToAdd);

//       // Assert
//       expect(mockStore.dispatch).toHaveBeenCalledWith(new ServiceLogsAdded(mockServices[0].service_id, logsToAdd));
//     });
//   });

//   describe('get service by type', () => {
//     const allServices = [
//       {
//         service_type: ServiceTypeEnum.GENERIC,
//         service_id: '234324',
//       },
//       {
//         service_type: ServiceTypeEnum.GENERIC,
//         service_id: '34324',
//       },
//       {
//         service_type: ServiceTypeEnum.TICKETING,
//         service_id: '2343456754724',
//       },
//       {
//         service_type: ServiceTypeEnum.FILEMONITOR,
//         service_id: '34546',
//       },
//       {
//         service_type: ServiceTypeEnum.GENERIC,
//         service_id: '23435765724',
//       },
//       {
//         service_type: ServiceTypeEnum.FILEMONITOR,
//         service_id: '3455',
//       },
//       {
//         service_type: ServiceTypeEnum.GENERIC,
//         service_id: '4656',
//       },
//       {
//         service_type: ServiceTypeEnum.FILEMONITOR,
//         service_id: '23434565624',
//       },
//       {
//         service_type: ServiceTypeEnum.TICKETING,
//         service_id: '43543543654334',
//       },
//     ];
//     beforeEach(() => {
//       const customState: ServicesState = {
//         initialized: true,
//         ids: allServices.map((s) => s.service_id),
//         entities: {
//           [allServices[0].service_id]: { service: allServices[0], serviceLogs: undefined },
//           [allServices[1].service_id]: { service: allServices[1], serviceLogs: undefined },
//           [allServices[2].service_id]: { service: allServices[2], serviceLogs: undefined },
//           [allServices[3].service_id]: { service: allServices[3], serviceLogs: undefined },
//           [allServices[4].service_id]: { service: allServices[4], serviceLogs: undefined },
//           [allServices[5].service_id]: { service: allServices[5], serviceLogs: undefined },
//           [allServices[6].service_id]: { service: allServices[6], serviceLogs: undefined },
//           [allServices[7].service_id]: { service: allServices[7], serviceLogs: undefined },
//           [allServices[8].service_id]: { service: allServices[8], serviceLogs: undefined },
//         },
//       };
//       mockStore.setState({ servicesState: customState });
//     });

//     it('should return only ticketing services', async () => {
//       // Arrange
//       const expectedResult = allServices.filter((s) => s.service_type === ServiceTypeEnum.TICKETING);

//       // Act
//       const actualResult = await service.getTicketingServices().pipe(take(1)).toPromise();

//       // Assert
//       expect(actualResult.map((s) => +s.service_id).sort()).toEqual(expectedResult.map((s) => +s.service_id).sort());
//     });

//     it('should return only generic services', async () => {
//       // Arrange
//       const expectedResult = allServices.filter((s) => s.service_type === ServiceTypeEnum.GENERIC);

//       // Act
//       const actualResult = await service.getGenericServices().pipe(take(1)).toPromise();

//       // Assert
//       expect(actualResult.map((s) => +s.service_id).sort()).toEqual(expectedResult.map((s) => +s.service_id).sort());
//     });

//     it('should return only filemonitor services', async () => {
//       // Arrange
//       const expectedResult = allServices.filter((s) => s.service_type === ServiceTypeEnum.FILEMONITOR);

//       // Act
//       const actualResult = await service.getFileMonitorServices().pipe(take(1)).toPromise();

//       // Assert
//       expect(actualResult.map((s) => +s.service_id).sort()).toEqual(expectedResult.map((s) => +s.service_id).sort());
//     });

//     it('should return only ticketing services with the specified ids', async () => {
//       // Arrange
//       const serviceIds = ['34546', '23435765724', '2343456754724'];
//       const expectedResult = allServices.filter(
//         (s) => s.service_type === ServiceTypeEnum.TICKETING && serviceIds.includes(s.service_id)
//       );

//       // Act
//       const actualResult = await service.getTicketingServices(serviceIds).pipe(take(1)).toPromise();

//       // Assert
//       expect(actualResult.map((s) => +s.service_id).sort()).toEqual(expectedResult.map((s) => +s.service_id).sort());
//     });
//   });
// });
