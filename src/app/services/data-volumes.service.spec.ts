import { TestBed } from '@angular/core/testing';

import { DataVolumesService } from './data-volumes.service';

describe('DataVolumesService', () => {
  let service: DataVolumesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataVolumesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
