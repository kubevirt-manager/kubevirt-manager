import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { KubevirtMgrService } from './kubevirt-mgr.service';

describe('KubevirtMgrService', () => {
  let service: KubevirtMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [], providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] });
    service = TestBed.inject(KubevirtMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


