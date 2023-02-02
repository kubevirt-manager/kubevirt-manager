import { TestBed } from '@angular/core/testing';
import { K8sService } from './k8s.service';
import { K8sTestdata } from '../test-data/k8s-testdata.model';

describe('K8sService', () => {
  let k8sService: K8sService;
  let stubService: jasmine.SpyObj<K8sService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('K8sService', ['getNodes','getNamespaces']);
    TestBed.configureTestingModule({
        providers: [
            K8sService,
            {provide: K8sService, useValue: spy}
        ]
    });
    k8sService = TestBed.inject(K8sService);
    stubService = TestBed.inject(K8sService) as jasmine.SpyObj<K8sService>;
  });

  it('service should be created', () => {
    expect(k8sService).toBeTruthy();
  });
  it('stub should be created', () => {
    expect(stubService).toBeTruthy();
  });
  it('testing getNodes', () => {
    let stubCrds = K8sTestdata.getNodes;
    stubService.getNodes.and.returnValue(<any>stubCrds);
  
    expect(k8sService.getNodes())
      .withContext('service returned stub value')
      .toBe(<any>stubCrds);
    expect(stubService.getNodes.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(stubService.getNodes.calls.mostRecent().returnValue)
      .toBe(<any>stubCrds);
  }); 
});
