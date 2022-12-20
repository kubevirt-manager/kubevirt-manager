import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { K8sService } from './k8s.service';

describe('K8sService', () => {
  let service: K8sService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(K8sService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
