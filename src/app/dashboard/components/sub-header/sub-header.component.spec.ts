import { ComponentFixture, TestBed } from '@angular/core/testing';
import {DatePipe} from '@angular/common';
import { SubHeaderComponent } from './sub-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieModule } from 'ngx-cookie';
import { ShrinkVisibilityService } from 'src/app/core/services/shrink-visibility/shrink-visibility.service';
import { MaterialModule } from 'src/app/shared/module/material.module';
import {of} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;
  let matDialog:MatDialog;
  let mockRouter = {
    url: '',
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubHeaderComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
            deps: [HttpClient],
          },
        }),
      ],
      providers: [DatePipe, ShrinkVisibilityService,MatDialog,
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA]

    });
    fixture = TestBed.createComponent(SubHeaderComponent);
    matDialog =TestBed.inject(MatDialog);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the default date range if filter is not applied', () => {
    spyOn(component, 'setDefaultDateRange');
    spyOn(component, 'setFilterDates');
    spyOn(localStorage, 'getItem').and.returnValue('false');
    component.ngOnInit();
    expect(component.setDefaultDateRange).toHaveBeenCalled();
    expect(component.setFilterDates).not.toHaveBeenCalled();
  });

  it('should set start and end dates from filterValues in localStorage', () => {
    const filterValues = {
      'start-date': '2023-01-01',
      'end-date': '2023-01-10',
    };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(filterValues));
    component.setFilterDates();
    expect(component.startDate).toEqual(filterValues['start-date']);
    expect(component.endDate).toEqual(filterValues['end-date']);
  });

  it('should set default start and end dates when filterValues is not in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.setFilterDates();
    const datePipe = new DatePipe('en-US');
    const defaultStartDate = datePipe.transform(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6),
        'yyyy-MM-dd'
    );
    const defaultEndDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
    expect(component.startDate).toEqual(defaultStartDate);
    expect(component.endDate).toEqual(defaultEndDate);
  });

  it('should update lastPosUploaded and lastShrinkDataRefreshed when getLastShrinkDataRefreshed is called', () => {
    const mockShrinkDataRefresh = {
      lastPosUploaded: '2023-01-01',
      lastShrinkDataRefreshed: '2023-01-02',
    };
    spyOn(component.commonService, 'getShrinkDataRefresh').and.returnValue(of(mockShrinkDataRefresh));
    component.getLastShrinkDataRefreshed();
    expect(component.lastPosUploaded).toEqual(mockShrinkDataRefresh.lastPosUploaded);
    expect(component.lastShrinkDataRefreshed).toEqual(mockShrinkDataRefresh.lastShrinkDataRefreshed);
  });

  it('should set the pageTitle correctly when getPageTitle is called', () => {
    const pageTitle = 'Custom Page Title';
    spyOn(component.commonService, 'getPageTitle').and.returnValue(of(pageTitle));
    component.getPageTitle();
    expect(component.pageTitle).toEqual(pageTitle);
  });

  it('should trigger data refresh when refreshData is called', () => {
    spyOn(component.commonService, 'sendRefreshClick');
    spyOn(component.authService, 'getSiteData');

    component.refreshData();

    expect(component.lastPosUploaded).toEqual('...');
    expect(component.lastShrinkDataRefreshed).toEqual('...');
    expect(component.commonService.sendRefreshClick).toHaveBeenCalledWith(true);
    expect(component.authService.getSiteData).toHaveBeenCalled();
  });

  it('should set pageTitle to "BULK SHRINK EVENTS" when the current URL includes "/bulk-shrink-events"', () => {
    mockRouter.url = '/bulk-shrink-events';
    component.InitialPageTitle();
    expect(component.pageTitle).toEqual('BULK SHRINK EVENTS');
  });

  it('should set pageTitle to "RFID Exit Read" when the current URL includes "/rfid-exit-read"', () => {
    mockRouter.url = '/rfid-exit-read';
    component.InitialPageTitle();
    expect(component.pageTitle).toEqual('RFID Exit Read');
  });

  it('should set pageTitle to "EPC Read List" when the current URL includes "/epc-read-list"', () => {
    mockRouter.url = '/epc-read-list';
    component.InitialPageTitle();
    expect(component.pageTitle).toEqual('EPC Read List');
  });

  it('should set pageTitle to "MANAGEMENT PERFORMANCE" when the current URL includes "/management-performance"', () => {
    mockRouter.url = '/management-performance';
    component.InitialPageTitle();
    expect(component.pageTitle).toEqual('MANAGEMENT PERFORMANCE');
  });

  it('should set pageTitle to "SHRINK VISIBILITY" for a URL that does not match any specific paths', () => {
    mockRouter.url = '/test';
    component.InitialPageTitle();
    expect(component.pageTitle).toEqual('SHRINK VISIBILITY');
  });

  it('should navigate to dashboard when onFilterClick is called and the currentURL matches the criteria', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);

    mockRouter.url = '/dashboard';
    component.onFilterClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);

    mockRouter.url = '/highest-shrink-by-site';
    component.onFilterClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);

    mockRouter.url = '/shrink-by-roll-up';
    component.onFilterClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should get total bulk event when getTotalBulkEventCount is called', () => {
    const totalBulkEvent = 500;
    spyOn(component.commonService, 'getTotalBulkEventCount').and.returnValue(of(totalBulkEvent));
    component.getBulkEventCount();
    expect(component.totalBulkEvent).toEqual(totalBulkEvent);
  });
});
