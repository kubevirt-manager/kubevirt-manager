import { TestBed } from '@angular/core/testing';

import { PrometheusService } from './prometheus.service';

describe('PrometheusService', () => {
  let service: PrometheusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrometheusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
