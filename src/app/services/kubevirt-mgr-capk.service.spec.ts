import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KubevirtMgrCapk } from './kubevirt-mgr-capk.service';


describe('KubevirtMgrCapk', () => {
    let service: KubevirtMgrCapk;
  
    beforeEach(() => {
      TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
      service = TestBed.inject(KubevirtMgrCapk);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
});

