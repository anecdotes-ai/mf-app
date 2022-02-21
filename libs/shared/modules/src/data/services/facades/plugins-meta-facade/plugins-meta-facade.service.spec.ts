import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MessageBusService } from 'core/services';
import { PluginService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { PluginsMetaFacadeService } from './plugins-meta-facade.service';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { PusherMessageType } from 'core/models';

describe('PluginsMetaFacadeService', () => {
  let service: PluginsMetaFacadeService;
  let pluginsService: PluginService;
  let messageBusService: MessageBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PluginsMetaFacadeService,
        { provide: PluginService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);
    service = TestBed.inject(PluginsMetaFacadeService);
    pluginsService = TestBed.inject(PluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getServiceMetadata', () => {
    let spy;
    const serviceId = 'test';
    const serviceInstanceId = '0000-test';
    const extraServiceid = 'test1';
    const serviceMeta = { bla: 'bla' };

    beforeEach(() => {
      pluginsService.getServiceMetadata = jasmine.createSpy('getServiceMetadata').and.returnValue(of(serviceMeta));
      spy = pluginsService.getServiceMetadata as jasmine.Spy<jasmine.Func>;
    });

    it('should return the service metadata', async () => {
      // Act
      const result = await service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(result).toEqual(serviceMeta);
    });

    it('should call getServiceMetadata method if there is no metadata for this service', async () => {
      // Act
      await service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('shouldnt call getServiceMetadata method if there is no metadata for this service', async () => {
      // Act
      await service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();
      await service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('shouldnt call getServiceMetadata method for every requested service', async () => {
      // Act
      await service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();
      await service.getServiceMetadata(extraServiceid, serviceInstanceId + "2").pipe(take(1)).toPromise();

      // Assert
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('#metaUpdate', () => {
    let spy;
    const serviceId = 'test';
    const serviceInstanceId = '0000-test';
    const extraServiceid = 'test1';
    const serviceMeta = { bla: 'bla' };
    const newServiceMeta = { bla: 'blobi' };

    beforeEach(() => {
      pluginsService.getServiceMetadata = jasmine.createSpy('getServiceMetadata').and.returnValue(of(serviceMeta));
      spy = pluginsService.getServiceMetadata as jasmine.Spy<jasmine.Func>;
    });

    it('should call pluginsService.getServiceMetadata if receieved service_meta_updated notification of exisitng service', fakeAsync(() => {
      // Arrange
      const msg = { message_object: { service_id: serviceId, service_instance_id: serviceInstanceId } };

      // Act
      service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();
      messageBusService.sendMessage(PusherMessageType.ServiceMetaUpdated, msg);
      tick();
      service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('shouldnt update existing service meta if service_meta_updated notification of different service', fakeAsync(() => {
      // Arrange
      const msg = { message_object: { service_id: extraServiceid } };

      // Act
      service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();
      messageBusService.sendMessage(PusherMessageType.ServiceMetaUpdated, msg);
      pluginsService.getServiceMetadata = jasmine.createSpy('getServiceMetadata').and.returnValue(of(serviceMeta));
      tick();
      service.getServiceMetadata(serviceId, serviceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);
    }));
  });
});
