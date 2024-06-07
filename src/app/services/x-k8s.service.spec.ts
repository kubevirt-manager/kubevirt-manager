import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { XK8sService } from './x-k8s.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('XK8sService', () => {
    let service: XK8sService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()] });
      service = TestBed.inject(XK8sService);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });
