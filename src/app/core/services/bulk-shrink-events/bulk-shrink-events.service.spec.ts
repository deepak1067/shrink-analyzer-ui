import { TestBed } from '@angular/core/testing';

import { BulkShrinkEventsService } from './bulk-shrink-events.service';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('BulkShrinkEventsService', () => {
  let service: BulkShrinkEventsService;
  let commonService:CommonService

  const expectedParsedData = [
    {
      'Event Time': 'Time1',
      'Event ID': 'event id 1',
      'Site Code': 'SiteCode1',
      'Exit Door ID': 'EPC1',
      'Event Count': 'SiteCode1',
      'Video URL': 'http://abc/sample/ForBiggerBlazes.mp4',
      'Status': 'Employee',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule, CookieModule.forRoot()],
      providers: [AuthService, CookieService, DatePipe, CommonService],
    });
    service = TestBed.inject(BulkShrinkEventsService);
    commonService = TestBed.inject(CommonService)

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get bulk event data from local file when useDataKey is false', () => {
    environment.useDataKey = false;
    spyOn(commonService as any, 'parseCsvData').and.returnValue(of(expectedParsedData));
    service.getBulkEvents().subscribe((parsedData) => {
      expect(parsedData).toEqual(expectedParsedData);
    });
  });

  it('should get bulk event data from API when useDataKey is true', () => {
    environment.useDataKey = true;
    spyOn(commonService as any, 'buildQueryParams').and.returnValue('param=value');
    spyOn(commonService as any, 'parseCsvData').and.returnValue(of(expectedParsedData));
    service.getBulkEvents().subscribe((parsedData) => {
      expect(parsedData).toEqual(expectedParsedData);
      expect(commonService.buildQueryParams).toHaveBeenCalled();
    });
  });

  it('should set Event label from the API via POST', () => {
    const eventId = 'Event 1';
    const eventLabel='Event Label 1'
    const response='success'
    service.setExitEventLabel(eventId,eventLabel).subscribe(data => {
        expect(data).toEqual(response);
    });
});

});
