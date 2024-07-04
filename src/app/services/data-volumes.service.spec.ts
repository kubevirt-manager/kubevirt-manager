import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DataVolumesService } from './data-volumes.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DataVolumesService', () => {
  let service: DataVolumesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] });
    service = TestBed.inject(DataVolumesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
