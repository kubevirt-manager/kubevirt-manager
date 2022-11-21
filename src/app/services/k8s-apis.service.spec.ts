import { TestBed } from '@angular/core/testing';

import { K8sApisService } from './k8s-apis.service';

describe('K8sApisService', () => {
  let service: K8sApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(K8sApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
