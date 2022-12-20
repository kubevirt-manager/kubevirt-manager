import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { DataVolumesService } from './data-volumes.service';

describe('DataVolumesService', () => {
  let service: DataVolumesService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(DataVolumesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
