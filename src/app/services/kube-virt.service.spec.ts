import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { KubeVirtService } from './kube-virt.service';

describe('KubeVirtService', () => {
  let service: KubeVirtService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(KubeVirtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
