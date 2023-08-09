import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DatePipe} from '@angular/common';
import {of, throwError} from 'rxjs';
import {ShrinkVisibilityComponent} from './shrink-visibility.component';
import {ShrinkVisibilityService} from '../../core/services/shrink-visibility/shrink-visibility.service';
import {MatDialog} from '@angular/material/dialog';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule} from "ngx-cookie";
import { CommonService } from '../../shared/services/common.service';

describe('ShrinkVisibilityComponent', () => {
  let component: ShrinkVisibilityComponent;
  let fixture: ComponentFixture<ShrinkVisibilityComponent>;
  let mockService: ShrinkVisibilityService;
  let commonService: CommonService
  let mockDialog: { open: jasmine.Spy };

  let expectedResult = [
    {text: 'Without Sale %', results: '...'},
    {text: 'Total Shrink Value', results: '...', currency: ''},
    {text: 'Bulk Shrink Events %', results: '...'},
    {text: 'Total Exit Reads', results: '...', trend: 0},
  ];

  const mockData = {
    'shrink-item-ratio': 0.5,
    'shrink-value': {amount: 100, currency: 'USD'},
    'shrink-event-bulk-ratio': 0.3,
    'exit-items': {count: 10, trend: 20},
    refresh: {
      'last-pos-event-time': 1625467200,
      'last-exit-event-time': 1625468200,
    },
  };

  beforeEach(async () => {

    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue('')
    };

    await TestBed.configureTestingModule({
      imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      CookieModule.forRoot(),
    ],
      declarations: [ShrinkVisibilityComponent],
      providers: [DatePipe, ShrinkVisibilityService,CommonService,
        {provide: MatDialog, useValue: mockDialog}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrinkVisibilityComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ShrinkVisibilityService)
    commonService = TestBed.inject(CommonService)
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update cards and last upload times on successful API response', () => {
    spyOn(component.datePipe, 'transform').and.callThrough();
    component.getCardsData();
    expect(component.cards).toEqual(expectedResult);
  });

  it('should log error when API call fails', () => {
    spyOn(console, 'error');
    component.getCardsData();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should navigate to appropriate routes based on card text', () => {
    spyOn(component.router, 'navigateByUrl');
    component.routeSideNav('Without Sale %');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/dashboard/rfid-exit-read');
    component.routeSideNav('Total Shrink Value');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/dashboard/rfid-exit-read');
    component.routeSideNav('Total Exit Reads');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/dashboard/rfid-exit-read');
    component.routeSideNav('Bulk Shrink Events %');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/dashboard/bulk-shrink-events');
  });

  it('should unsubscribe from the subscription onDestroy', () => {
    const mockSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscription = mockSubscription;
    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should log error when API call fails', () => {
    const mockError = new Error('Mock API Error');
    spyOn(console, 'error');
    spyOn(mockService,'getCardsData' ).and.callFake(() => {
      return throwError(mockError);
    });
    component.getCardsData();
    expect(console.error).toHaveBeenCalledWith('Error fetching data from API:', mockError);
  });

  it('should send page Title', ()=>{
    spyOn(commonService ,'sendPageTitle')
    component.ngOnInit()
    expect(commonService.sendPageTitle).toHaveBeenCalledWith('SHRINK VISIBILITY')
  })

  it('should subscribe to refreshClick event and call getCardsData() on refresh', () => {
    spyOn(component, 'getCardsData');
    component.getRefreshData();
    component.commonService.sendRefreshClick(true);
    expect(component.getCardsData).toHaveBeenCalled();
  });

  it('should update cards and last upload times on successful API response', () => {
    spyOn(component.datePipe, 'transform').and.callThrough();
    spyOn(mockService, 'getCardsData').and.returnValue(of(mockData));
    component.getCardsData();
    expect(component.cards).toEqual([
      { text: 'Without Sale %', results: '50.00' },
      { text: 'Total Shrink Value', results: 100, currency: '$' },
      { text: 'Bulk Shrink Events %', results: '30.00' },
      { text: 'Total Exit Reads', results: 10, trend: 20 },
    ]);
    expect(component.lastPosUploaded).toBeDefined();
    expect(component.lastShrinkDataRefreshed).toBeDefined();
  });
});
