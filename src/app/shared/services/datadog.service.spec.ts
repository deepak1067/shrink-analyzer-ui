import { TestBed } from '@angular/core/testing';

import { DataDogService } from './datadog.service';

describe('DatadogService', () => {
  let service: DataDogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
