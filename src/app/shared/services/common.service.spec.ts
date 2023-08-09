import { TestBed } from '@angular/core/testing';
import {saveAs} from "file-saver";
import { CommonService } from './common.service';
import { FilterChange } from 'src/app/modules/shrink-visibility/shrink-visibility.model';
import { environment } from 'src/environments/environment';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { ShrinkVisibilityService } from 'src/app/core/services/shrink-visibility/shrink-visibility.service';

describe('CommonService', () => {
  let service: CommonService;
  let httpMock: HttpTestingController;
  let cookieService: CookieService;
  let datePipe: DatePipe;
  const filterValues = {
    'start-date': '2023-01-01',
    'end-date': '2023-01-31',
    'start-time': 0,
    'end-time': 0,
    'site-code': 'ABC',
    'site-name': 'Site 1',
    'site-label': 'Label 1',
    'site-directory': 'Directory 1',
    'event-label': 'Event 1',
    'bulk-tags': 'Tag 1',
    'epc': 'EPC 1',
    'include-not-in-catalog': true
};

const params = {
  'tenant-id': 'mock-tenant-id',
  'end-date': formatDate(new Date(), 'yyyyMMdd', 'en'),
  'start-date': formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      new Date().getDate() - 6), 'yyyyMMdd', 'en'),
  'start-time': 0,
  'end-time': 0,
  'site-code': 'ABC',
  'site-name': 'Site 1',
  'site-label': 'Label 1',
  'site-directory': 'Directory 1',
  'event-label': 'Event 1',
  'bulk-tags': 'Tag 1',
  'epc': 'EPC 1',
  'include-not-in-catalog': true,
  'key': environment.api.routes.apis.dataKey
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
    ],
    providers: [
        AuthService,
        CookieService,
        ShrinkVisibilityService,
        DatePipe
    ]
    });
    service = TestBed.inject(CommonService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    localStorage.setItem('filterValues', JSON.stringify(filterValues));
    spyOn(cookieService, 'get').and.returnValue('mock-tenant-id');
    datePipe = TestBed.inject(DatePipe);
    environment.useDataKey = true
    localStorage.setItem('filterValues', JSON.stringify(filterValues));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send refresh click event', () => {
    const sendRefreshValue = true;
    service.getRefreshClick().subscribe((value) => {
        expect(value).toBe(sendRefreshValue);
    });
    service.sendRefreshClick(sendRefreshValue);
});

it('should send filter applied value', () => {
  const mockFilterValue:FilterChange ={
      applied: true,
      clearAction: false,
      pageUrl: '/dashboard'
  };
  service.getFilterAppliedValue().subscribe((value) => {
      expect(value).toEqual(mockFilterValue);
  });
  service.sendFilterAppliedValue(mockFilterValue)
});

it('should update query parameters', () => {
  service.setDefaultDateRange();
  service.setDefaultQueryParams();

  service['isFilter'] = true;
  service['startDate'] = filterValues['start-date'];
  service['endDate'] = filterValues['end-date'];
  service['queryParams']['start-time'] = filterValues['start-time'];
  service['queryParams']['end-time'] = filterValues['end-time'];
  service['queryParams']['site-code'] = filterValues['site-code'];
  service['queryParams']['site-name'] = filterValues['site-name'];
  service['queryParams']['site-label'] = filterValues['site-label'];
  service['queryParams']['site-directory'] = filterValues['site-directory'];
  service['queryParams']['event-label'] = filterValues['event-label'];
  service['queryParams']['bulk-tags'] = filterValues['bulk-tags'];
  service['queryParams']['epc'] = filterValues['epc'];
  service['queryParams']['include-not-in-catalog'] = filterValues['include-not-in-catalog'];

  expect(service.queryParams).toEqual(params);
});

it('should set default query parameters correctly', () => {
  service.setDefaultDateRange();
  service.setDefaultQueryParams();

  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
  const formattedStartDate = formatDate(startDate, 'yyyyMMdd', 'en');
  const formattedEndDate = formatDate(currentDate, 'yyyyMMdd', 'en');

  const expectedParams = {
      "tenant-id": "mock-tenant-id",
      "start-date": formattedStartDate,
      "end-date": formattedEndDate,
      'start-time': 0,
      'end-time': 0,
      'site-code': [],
      'site-name': [],
      'site-label': [],
      'include-not-in-catalog': false,
      "site-directory": [],
      "event-label": [],
      "bulk-tags": [],
      "epc": '',
      "key": environment.api.routes.apis.dataKey,
  };
  expect(service.queryParams).toEqual(expectedParams);
});


    it('should download file', () => {
        spyOn(saveAs, 'saveAs');

        const data = [{name: 'John', age: 25}, {name: 'Jane', age: 30}];
        const fileName = 'data';
        const startDate = '20230101';
        const endDate = '20230131';

        service.downloadFile(data, fileName, startDate, endDate);
        expect(saveAs).toHaveBeenCalledTimes(1);
    });

 

    it('should build query parameters correctly', () => {
        const params = {
            param1: 'value1',
            param2: 0,
            param3: null,
            param4: ['a', 'b'],
            param5: '',
            param6: undefined,
            param7: 'value7',
            'start-time': 24,
            'end-time': 24,
        };

        const expectedQueryParams = 'param1=value1&param2=0&param4=a%2Cb&param7=value7&start-time=0&end-time=0';

        const result = (service as any).buildQueryParams(params);
        expect(result).toEqual(expectedQueryParams);
    });

    it('should handle empty object', () => {
        const params = {};

        const expectedQueryParams = '';

        const result = (service as any).buildQueryParams(params);
        expect(result).toEqual(expectedQueryParams);
    });

    it('should handle array values', () => {
        const params = {
            param1: ['a', 'b'],
            param2: [1, 2, 3],
            param3: [],
        };

        const expectedQueryParams = 'param1=a%2Cb&param2=1%2C2%2C3';

        const result = (service as any).buildQueryParams(params);
        expect(result).toEqual(expectedQueryParams);
    });

    it('should handle null and undefined values', () => {
        const params = {
            param1: null,
            param2: undefined,
            param3: 'value3',
        };

        const expectedQueryParams = 'param3=value3';

        const result = (service as any).buildQueryParams(params);
        expect(result).toEqual(expectedQueryParams);
    });

    it('should return the default start date correctly', () => {
        const currentDate = new Date(2023, 6, 25);
        spyOn(Date, 'now').and.returnValue(currentDate.getTime());
        const expectedStartDate = <string>datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6), 'yyyyMMdd');
        const result = (service as any).getDefaultStartDate();
        expect(result).toEqual(expectedStartDate);
    });

    it('should return the default end date correctly', () => {
        const currentDate = new Date();
        spyOn(Date, 'now').and.returnValue(currentDate.getTime());
        const expectedEndDate = <string>datePipe.transform(new Date(), 'yyyyMMdd');
        const result = (service as any).getDefaultEndDate();
        expect(result).toEqual(expectedEndDate);
    });

    it('should set default date range and query params when filter is not applied', () => {
        localStorage.setItem('filterValues', JSON.stringify(filterValues));
        localStorage.setItem('isFilterApplied', 'false');
        spyOn(service as any, 'setDefaultDateRange').and.callThrough();
        spyOn(service as any, 'setDefaultQueryParams').and.callThrough();
        (service as any).updateQueryParams();
        expect(service['setDefaultDateRange']).toHaveBeenCalled();
        expect(service['setDefaultQueryParams']).toHaveBeenCalled();
        const expectedParams = {
            "tenant-id": "mock-tenant-id",
            "start-date": jasmine.any(String),
            "end-date": jasmine.any(String),
            'start-time': 0,
            'end-time': 0,
            'site-code': [],
            'site-name': [],
            'site-label': [],
            'include-not-in-catalog': false,
            "site-directory": [],
            "event-label": [],
            "bulk-tags": [],
            "epc": '',
            "key": environment.api.routes.apis.dataKey,
        };
        expect(service.queryParams).toEqual(expectedParams);
    });

    it('should update query parameters based on filterValues', () => {
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(filterValues));
        spyOn(service, 'getDefaultStartDate').and.returnValue('20230119');
        spyOn(service, 'getDefaultEndDate').and.returnValue('20230125');
        service['updateQueryParams']();
        expect(localStorage.getItem).toHaveBeenCalledWith('filterValues');
        expect(service.getDefaultStartDate).not.toHaveBeenCalled();
        expect(service.getDefaultEndDate).not.toHaveBeenCalled();
        const expectedParams = {
            "tenant-id": "mock-tenant-id",
            "start-date": "2023-01-01",
            "end-date": "2023-01-31",
            "start-time": 0,
            "end-time": 0,
            "site-code": "ABC",
            "site-name": "Site 1",
            "site-label": "Label 1",
            "site-directory": "Directory 1",
            "event-label": "Event 1",
            "bulk-tags": "Tag 1",
            'itemLabel': undefined,
            "include-not-in-catalog": true,
            "epc": "EPC 1",
            "key": environment.api.routes.apis.dataKey,
        };
        expect(service.queryParams).toEqual(expectedParams);
    });

    it('should handle start-time and end-time as 0 correctly', () => {
        const filterValuesWithZeroTimes = {
            ...filterValues, 'start-time': 0, 'end-time': 0,
        };
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(filterValuesWithZeroTimes));
        spyOn(service, 'getDefaultStartDate').and.returnValue('20230119');
        spyOn(service, 'getDefaultEndDate').and.returnValue('20230125');

        service['updateQueryParams']();

        expect(localStorage.getItem).toHaveBeenCalledWith('filterValues');
        expect(service.getDefaultStartDate).not.toHaveBeenCalled();
        expect(service.getDefaultEndDate).not.toHaveBeenCalled();

        const expectedParams = {
            "tenant-id": "mock-tenant-id",
            "start-date": "2023-01-01",
            "end-date": "2023-01-31",
            "start-time": 0,
            "end-time": 0,
            "site-code": "ABC",
            "site-name": "Site 1",
            "site-label": "Label 1",
            "site-directory": "Directory 1",
            "event-label": "Event 1",
            "bulk-tags": "Tag 1",
            'itemLabel': undefined,
            "include-not-in-catalog": true,
            "epc": "EPC 1",
            "key": environment.api.routes.apis.dataKey,
        };
        expect(service.queryParams).toEqual(expectedParams);
    });

    it('should parse CSV data correctly', (done) => {
        const csvData = 'name,age\nJohn,25\nJane,30\n';
        const expectedParsedData = [{ name: 'John', age: '25' }, { name: 'Jane', age: '30' }];
        service['parseCsvData']('mock-url').subscribe((parsedData) => {
            expect(parsedData).toEqual(expectedParsedData);
            done();
        });
        const req = httpMock.expectOne('mock-url');
        expect(req.request.method).toBe('GET');
        req.flush(csvData);
    });

    it('should send Shrink Data Refresh', () => {
        const mockShrinkDataRefresh ={
            "lastShrinkDataRefreshed": '76868786' ,
            "lastPosUploaded": '9989878'
        }
         service.getShrinkDataRefresh().subscribe((value) => {
             expect(value).toEqual(mockShrinkDataRefresh);
         });
         service.sendShrinkDataRefresh(mockShrinkDataRefresh);
    });

    it('should send page Title', () => {
       const mockPageTitle ='SHRINK VISIBILITY'
        service.getPageTitle().subscribe((value) => {
            expect(value).toEqual(mockPageTitle);
        });
        service.sendPageTitle(mockPageTitle);
    });

     it('should send total Bulk Events', () => {
       const mockTotalBulkEvents = 500
        service.getTotalBulkEventCount().subscribe((value) => {
            expect(value).toEqual(mockTotalBulkEvents);
        });
        service.setTotalBulkEventCount(mockTotalBulkEvents);
    });

});
