import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { EpcReadListService } from './epc-read-list.service';
import { CommonService } from '../../../shared/services/common.service';

describe('EpcReadListService', () => {
  let service: EpcReadListService;
  let commonService:CommonService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule, CookieModule.forRoot()],
      providers: [AuthService, CookieService, DatePipe, CommonService],
    });
    commonService = TestBed.inject(CommonService)
    service = TestBed.inject(EpcReadListService);
    environment.useDataKey = true;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get EPC read list data from local file when useDataKey is false', (done) => {
    const expectedParsedData = [
      {
        'Event Time': 'Time1',
        'Exit Event ID': '',
        'POS Transaction ID': '',
        EPC: 'EPC1',
        'Site Code': 'SiteCode1',
        'Read Point': 'Point1',
        'Last Read Time': '',
        'Product Code': '',
        'product-attributes': [],
      },
    ];
    environment.useDataKey = false;
    spyOn(commonService as any, 'parseCsvData').and.returnValue(of(expectedParsedData));
    service.getEPCReadList().subscribe((parsedData) => {
      expect(parsedData).toEqual(expectedParsedData);
      done();
    });
  });

  it('should get EPC read list data from API when useDataKey is true', (done) => {
    const expectedParsedData = [
      {
        'Event Time': 'Time2',
        'Exit Event ID': '',
        'POS Transaction ID': '',
        'EPC': 'EPC2',
        'Site Code': 'SiteCode2',
        'Read Point': 'Point2',
        'Last Read Time': '',
        'Product Code': '',
        'product-attributes': [],
      },
    ];
    environment.useDataKey = true;
    spyOn(commonService as any, 'buildQueryParams').and.returnValue('param=value');
    spyOn(commonService as any, 'parseCsvData').and.returnValue(of(expectedParsedData));
    service.getEPCReadList().subscribe((parsedData) => {
      expect(parsedData).toEqual(expectedParsedData);
      expect(commonService.buildQueryParams).toHaveBeenCalled();
      done();
    });
  });
});