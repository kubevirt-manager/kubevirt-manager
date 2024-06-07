import { TestBed } from '@angular/core/testing';

import { KubevirtMgrService } from './kubevirt-mgr.service';

describe('KubevirtMgrService', () => {
  let service: KubevirtMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KubevirtMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
