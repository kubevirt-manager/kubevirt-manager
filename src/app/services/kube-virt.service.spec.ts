import { TestBed } from '@angular/core/testing';
import { KubeVirtService } from './kube-virt.service';
import { KubeVirtTestdata } from '../test-data/kube-virt-testdata.model';

describe('KubeVirtService', () => {
  let kubeVirtService: KubeVirtService;
  let stubService: jasmine.SpyObj<KubeVirtService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('KubeVirtService', ['getVM']);
    TestBed.configureTestingModule({
        providers: [
            KubeVirtService,
            { provide: KubeVirtService, useValue: spy}
        ]
    });
    kubeVirtService = TestBed.inject(KubeVirtService);
    stubService = TestBed.inject(KubeVirtService) as jasmine.SpyObj<KubeVirtService>;
  });

  it('service should be created', () => {
    expect(kubeVirtService).toBeTruthy();
  });
  it('stub should be created', () => {
    expect(stubService).toBeTruthy();
  }); 
  it('testing getVM', () => {
    let stubVM = KubeVirtTestdata.getVM;
    stubVM.metadata.name = "this-test-vm";
    stubVM.metadata.namespace = "this-test-namespace";

    stubService.getVM.and.returnValue(<any>stubVM);
  
    expect(kubeVirtService.getVM("this-test-namespace", "this-test-vm"))
      .withContext('service returned stub value')
      .toBe(<any>stubVM);
    expect(stubService.getVM.calls.count())
      .withContext('spy method was called once')
      .toBe(1);
    expect(stubService.getVM.calls.mostRecent().returnValue)
      .toBe(<any>stubVM);
  });
});
