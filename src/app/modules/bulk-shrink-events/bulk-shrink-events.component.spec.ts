import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkShrinkEventsComponent } from './bulk-shrink-events.component';
import {  DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterChange } from '../shrink-visibility/shrink-visibility.model';
import { of } from 'rxjs';
import { BulkShrinkEventsService } from 'src/app/core/services/bulk-shrink-events/bulk-shrink-events.service';
import { SiteApiResponseService } from 'src/app/core/services/site-api-response.service';

describe('BulkShrinkEventsComponent', () => {
  let component: BulkShrinkEventsComponent;
  let commonService:CommonService;
  let bulkShrinkEventsService:BulkShrinkEventsService;
  let siteApiResponseService: SiteApiResponseService
  let fixture: ComponentFixture<BulkShrinkEventsComponent>;
  const mockBulkEventData = [
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
      declarations: [BulkShrinkEventsComponent],
      imports:[HttpClientTestingModule,
         CookieModule.forRoot(),],
      providers: [AuthService, CookieService, DatePipe, CommonService, BulkShrinkEventsService,SiteApiResponseService],
      schemas: [NO_ERRORS_SCHEMA]

    });
    fixture = TestBed.createComponent(BulkShrinkEventsComponent);
    commonService = TestBed.inject(CommonService);
    bulkShrinkEventsService = TestBed.inject(BulkShrinkEventsService);
    siteApiResponseService = TestBed.inject(SiteApiResponseService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send page Title', ()=>{
    spyOn(commonService ,'sendPageTitle')
    component.ngOnInit()
    expect(commonService.sendPageTitle).toHaveBeenCalledWith('BULK SHRINK EVENTS')
  })

  it('should call getBulkShrinkEventsData if applied is true', () => {
    const updateFilter:FilterChange = {
      applied: true,
      clearAction: false,
      pageUrl: '/dashboard/bulk-shrink-events'
  };
    spyOn(commonService, 'getFilterAppliedValue').and.returnValue(of(updateFilter));
    spyOn(component, 'getBulkShrinkEventsData');
    component.getFilterAppliedValue();
    expect(component.getBulkShrinkEventsData).toHaveBeenCalled();
  });

   it('should fetch EpcReadList and update isLoading', () => {
    component.isLoading = true
   
    spyOn(bulkShrinkEventsService, 'getBulkEvents').and.returnValue(of(mockBulkEventData));
    spyOn(siteApiResponseService, 'getSiteNameBySiteCode');
    component.getBulkShrinkEventsData();
    expect(component.isLoading).toBe(false);
    expect(component.bulkShrinkEvents.length).toBe(mockBulkEventData.length);
  });

  it("should generate formatted data correctly", () => {
    const formattedData = component.generateFormattedData(mockBulkEventData[0]);
    expect(formattedData["Date/Time"]).toEqual("Time1");
    expect(formattedData["Exit Door"]).toEqual("EPC1");
  });
});
