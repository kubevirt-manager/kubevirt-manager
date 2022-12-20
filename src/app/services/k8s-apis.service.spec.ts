import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { K8sApisService } from './k8s-apis.service';

describe('K8sApisService', () => {
  let service: K8sApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(K8sApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
