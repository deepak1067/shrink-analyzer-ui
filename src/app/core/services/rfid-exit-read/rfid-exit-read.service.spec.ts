import { TestBed } from '@angular/core/testing';

import { RfidExitReadService } from './rfid-exit-read.service';

describe('RfidExitReadService', () => {
  let service: RfidExitReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfidExitReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
