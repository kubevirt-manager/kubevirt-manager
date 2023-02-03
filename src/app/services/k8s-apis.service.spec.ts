import { TestBed } from '@angular/core/testing';
import { K8sApisService } from './k8s-apis.service';
import { K8sApisTestdata } from '../test-data/k8s-apis-testdata.model';


describe('K8sApisService', () => {
  let k8sApisService: K8sApisService;
  let stubService: jasmine.SpyObj<K8sApisService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('K8sApisService', ['getCrds','getNetworkAttachs','getStorageClasses','getPriorityClasses']);
    TestBed.configureTestingModule({
        providers: [
            K8sApisService,
            { provide: K8sApisService, useValue: spy}
        ]
    });
    k8sApisService = TestBed.inject(K8sApisService);
    stubService = TestBed.inject(K8sApisService) as jasmine.SpyObj<K8sApisService>;
  });

  it('service should be created', () => {
    expect(k8sApisService).toBeTruthy();
  });
  it('stub should be created', () => {
    expect(stubService).toBeTruthy();
  });
  it('testing getCrds', () => {
    let stubCrds = K8sApisTestdata.getCrds;
    stubService.getCrds.and.returnValue(<any>stubCrds);
  
    expect(k8sApisService.getCrds())
      .withContext('service returned stub value')
      .toBe(<any>stubCrds);
    expect(stubService.getCrds.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(stubService.getCrds.calls.mostRecent().returnValue)
      .toBe(<any>stubCrds);
  });
  it('testing getNetworkAttachs', () => {
    let stubNads = K8sApisTestdata.getNetworkAttachs;
    stubService.getNetworkAttachs.and.returnValue(<any>stubNads);
  
    expect(k8sApisService.getNetworkAttachs())
      .withContext('service returned stub value')
      .toBe(<any>stubNads);
    expect(stubService.getNetworkAttachs.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(stubService.getNetworkAttachs.calls.mostRecent().returnValue)
      .toBe(<any>stubNads);
  });
  it('testing getStorageClasses', () => {
    let stubScs = K8sApisTestdata.getStorageClasses;
    stubService.getStorageClasses.and.returnValue(<any>stubScs);
  
    expect(k8sApisService.getStorageClasses())
      .withContext('service returned stub value')
      .toBe(<any>stubScs);
    expect(stubService.getStorageClasses.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(stubService.getStorageClasses.calls.mostRecent().returnValue)
      .toBe(<any>stubScs);
  });
  it('testing getPriorityClasses', () => {
    let stubPcs = K8sApisTestdata.getPriorityClasses
    stubService.getPriorityClasses.and.returnValue(<any>stubPcs);
  
    expect(k8sApisService.getPriorityClasses())
      .withContext('service returned stub value')
      .toBe(<any>stubPcs);
    expect(stubService.getPriorityClasses.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(stubService.getPriorityClasses.calls.mostRecent().returnValue)
      .toBe(<any>stubPcs);
  });
});
