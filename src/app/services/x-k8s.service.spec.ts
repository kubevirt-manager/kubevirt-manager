import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XK8sService } from './x-k8s.service';

describe('XK8sService', () => {
    let service: XK8sService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
      service = TestBed.inject(XK8sService);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });
