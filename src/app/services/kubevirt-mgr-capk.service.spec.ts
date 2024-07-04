import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KubevirtMgrCapk } from './kubevirt-mgr-capk.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('KubevirtMgrCapk', () => {
    let service: KubevirtMgrCapk;
  
    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] });
      service = TestBed.inject(KubevirtMgrCapk);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
});

