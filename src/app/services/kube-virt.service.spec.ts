import { TestBed } from '@angular/core/testing';

import { KubeVirtService } from './kube-virt.service';

describe('KubeVirtService', () => {
  let service: KubeVirtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KubeVirtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
