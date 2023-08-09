import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CookieModule, CookieService} from 'ngx-cookie';
import {ShrinkVisibilityService} from './shrink-visibility.service';
import {AuthService} from '../auth.service';
import {RouterTestingModule} from "@angular/router/testing";
import {environment} from "../../../../environments/environment";
import {DatePipe} from "@angular/common";
import { of } from 'rxjs';
import { CommonService } from '../../../shared/services/common.service';

describe('ShrinkVisibilityService', () => {
    let service: ShrinkVisibilityService;
    let httpMock: HttpTestingController;
    let cookieService: CookieService;
    let commonService: CommonService;



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
                CommonService,
                DatePipe
            ]
        });
        service = TestBed.inject(ShrinkVisibilityService);
        httpMock = TestBed.inject(HttpTestingController);
        cookieService = TestBed.inject(CookieService);
        commonService = TestBed.inject(CommonService);
        spyOn(cookieService, 'get').and.returnValue('mock-tenant-id');
        environment.useDataKey = true
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get cards data', () => {
        spyOn(commonService as any, 'updateQueryParams').and.callThrough();
        spyOn(commonService as any, 'buildQueryParams').and.returnValue('key');
        service.getCardsData().subscribe();
        expect(commonService['updateQueryParams']).toHaveBeenCalled();
        expect(commonService['buildQueryParams']).toHaveBeenCalledWith(commonService.queryParams);
        const req = httpMock.expectOne(`${service['cardUrl']}?key`);
        expect(req.request.method).toBe('GET');
        req.flush(null);
    });

    it('should get shrink events by sites data', () => {
        spyOn(commonService as any, 'buildQueryParams').and.returnValue('mock-query-params');
        service.getShrinkEventBySitesData().subscribe();
        expect(commonService['buildQueryParams']).toHaveBeenCalledWith(commonService.queryParams);
        const req = httpMock.expectOne(`${service['shrinkEventsBySitesUrl']}?mock-query-params`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should get days of week data', () => {
        spyOn(commonService as any, 'buildQueryParams').and.returnValue('mock-query-params');
        service.getShrinkEventsByDay().subscribe();
        expect(commonService['buildQueryParams']).toHaveBeenCalledWith(commonService.queryParams);
        const req = httpMock.expectOne(`${service['getShrinkEventsByDayUrl']}?mock-query-params`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should get hours of the week data', () => {
        spyOn(commonService as any, 'buildQueryParams').and.returnValue('mock-query-params');
        service.getHoursOfWeekData().subscribe();
        expect(commonService['buildQueryParams']).toHaveBeenCalledWith(commonService.queryParams);
        const req = httpMock.expectOne(`${service['getHoursOfTheDay']}?mock-query-params`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });
 
    it('should get product attributes data', () => {
        spyOn(commonService as any, 'buildQueryParams').and.returnValue('mock-query-params');
        service.getProductAttributes().subscribe();
        expect(commonService['buildQueryParams']).toHaveBeenCalledWith({ tenantId: 'mock-tenant-id', "key": environment.api.routes.apis.dataKey });
        const req = httpMock.expectOne(`${service.productAttributeUrl}?mock-query-params`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('should get shrink events by product attribute data', () => {
        const attribute = 'Color';
        spyOn(commonService as any, 'buildQueryParams').and.returnValue('mock-query-params');
        spyOn(commonService as any, 'parseCsvData').and.returnValue(of([]));
        service.getShrinkEventsByProductAttributeData(attribute).subscribe();
        expect(commonService['buildQueryParams']).toHaveBeenCalledWith({...commonService.queryParams, attribute,});
        expect(commonService['parseCsvData']).toHaveBeenCalledWith(`${service.shrinkEventsByProductAttributeUrl}?mock-query-params`);
    });
});
