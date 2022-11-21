import { TestBed } from '@angular/core/testing';

import { K8sService } from './k8s.service';

describe('K8sService', () => {
  let service: K8sService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(K8sService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
