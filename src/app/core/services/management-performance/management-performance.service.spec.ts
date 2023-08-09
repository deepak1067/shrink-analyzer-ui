import { TestBed } from '@angular/core/testing';

import { ManagementPerformanceService } from './management-performance.service';

describe('ManagementPerformanceService', () => {
  let service: ManagementPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
