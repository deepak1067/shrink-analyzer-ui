import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HighestShrinkBySitesComponent} from './highest-shrink-by-sites.component';
import {ShrinkBySites} from "../shrink-visibility.model";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule} from "ngx-cookie";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {DatePipe} from "@angular/common";

describe('HighestShrinkBySitesComponent', () => {
  let component: HighestShrinkBySitesComponent;
  let fixture: ComponentFixture<HighestShrinkBySitesComponent>;
  let testData: ShrinkBySites[] = [
    {
      'site-code': 'SiteCode1',
      'shrink-event-count': 10,
      'shrink-item-ratio': 0.5,
      'bulk-event-ratio': 0.2,
      'shrink-event-trend': 42
    },
    {
      'site-code': 'SiteCode2',
      'shrink-event-count': 15,
      'shrink-item-ratio': 0.8,
      'bulk-event-ratio': 0.3,
      'shrink-event-trend': 89
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      providers: [DatePipe],
      declarations: [HighestShrinkBySitesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HighestShrinkBySitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEventsBySites() in ngOnInit()', () => {
    spyOn(component, 'getEventsBySites');
    component.ngOnInit();
    expect(component.getEventsBySites).toHaveBeenCalled();
  });

  it('should update shrinkEventsBySite when getEventsBySites() is called', () => {
    spyOn(component.shrinkVisibilityService, 'getShrinkEventBySitesData').and.returnValue(of(testData));
    component.getEventsBySites();
    expect(component.shrinkEventsBySite.every(item => item.hasOwnProperty('formattedData'))).toBeTrue();
  });

  it('should set the view type according to the button clicked', () => {
    const event = 'map';
    component.onToggleClick(event)
    expect(component.viewType).toEqual('map');
  });

  it('should call downloadFile() when downloadFile() is called with "table" viewType', () => {
    spyOn(component, 'downloadFile');
    component.viewType = 'table';
    component.downloadFile('event');
    expect(component.downloadFile).toHaveBeenCalledWith('event');
  });

  it('should call shrinkVisibilityService.downloadFile() when downloadFile() is called with "table" viewType', () => {
    const mockData: ShrinkBySites[] = testData;
    spyOn(component.shrinkEventsBySite, 'map').and.returnValue(mockData);
    spyOn(component.commonService, 'downloadFile');
    component.viewType = 'table';
    component.downloadFile('event');
    const startDate = component.commonService.startDate;
    const endDate = component.commonService.endDate;
    expect(component.commonService.downloadFile).toHaveBeenCalledWith(
      mockData, 'Highest_Shrink_By_Sites', startDate, endDate);
  });

  it('should call commonService.downloadChartAsPDF() when downloadFile() is called with "chart" viewType', () => {
    spyOn(component.commonService, 'downloadChartAsPDF');
    component.viewType = 'chart';
    component.chartId = 'shrinkBarChart';
    component.downloadFile('event');
    const startDate = component.commonService.startDate;
    const endDate = component.commonService.endDate;
    expect(component.commonService.downloadChartAsPDF).toHaveBeenCalledWith(
      'shrinkBarChart', 'highest-shrink-chart', startDate, endDate
    );
  });

  it('should set the chart id', () => {
    component.getChartId('shrinkBarChart')
    expect(component.chartId).toEqual('shrinkBarChart');
  });

  it('should set the map id', () => {
    component.getMapId('map')
    expect(component.mapId).toEqual('map');
  });

  it('should call downloadMapAsPDF when download is clicked with map viewType', () => {
    spyOn(component.commonService, 'downloadMapAsPDF');
    component.viewType = 'map';
    component.mapId = 'map';
    component.downloadFile('event');
    expect(component.commonService.downloadMapAsPDF).toHaveBeenCalled();
  });
});
