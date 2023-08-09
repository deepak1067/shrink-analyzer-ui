import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {Coordinates, ShrinkBySites} from '../shrink-visibility.model';
import {ShrinkVisibilityService} from '../../../core/services/shrink-visibility/shrink-visibility.service';
import {SiteApiResponseService} from "../../../core/services/site-api-response.service";
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-highest-shrink-by-sites',
  templateUrl: './highest-shrink-by-sites.component.html',
  styleUrls: ['./highest-shrink-by-sites.component.scss']
})
export class HighestShrinkBySitesComponent {
  shrinkBySites$!: Subscription;
  refreshEvent$!: Subscription;
  shrinkEventsBySite: ShrinkBySites[] = [];
  siteCodeMap: Map<string, string> = new Map();
  isLoading = false;
  viewType: string = "map";
  chartId!: string;
  mapId!: string;
  coordinates: Coordinates[] =[];
  siteCoordinate!: any;
  public eventColumnDef: (ColDef | ColGroupDef)[] = [
    { field: 'site-code', colId:'siteId', headerName: 'Site ID' ,filter: 'agTextColumnFilter', suppressMenu: true,unSortIcon: true },
    { field: 'site-name', colId:'siteName', headerName: 'Site Name' ,filter: 'agTextColumnFilter', suppressMenu: true,unSortIcon: true},
    { field: 'shrink-event-count',colId:'shrinkEvents', headerName: 'Shrink Events' ,filter: 'agTextColumnFilter', suppressMenu: true,unSortIcon: true},
    { field: 'bulk-event-ratio',colId:'bulkShrinksPercent', headerName: '% Bulk Events' ,filter: 'agTextColumnFilter', suppressMenu: true,unSortIcon: true,
      valueGetter: (params) => params.data.formattedData['% Bulk Events'] },
    { field: 'shrink-event-trend',colId:'changeInShrinkPercent', headerName: '% Change in Shrink' ,filter: 'agTextColumnFilter', suppressMenu: true,unSortIcon: true,
      valueGetter: (params) => params.data.formattedData['% Change in Shrink'] },
    { field: 'shrink-event-trend',colId:'trendArrow', headerName: 'Trend Arrow',unSortIcon: true, filter: false,
    cellRenderer: (params: { value: number; }) => params.value > 0 ?
     `<img src="assets/svg/Arrow_Green.svg" alt="arrow" height="auto" width="auto">`  : 
     `<img src="assets/svg/Arrow_Red.svg" alt="arrow" height="auto" width="auto">`},
    { field: 'shrink-item-ratio',colId:'withoutSales', headerName: 'WOS %' ,filter: 'agTextColumnFilter', suppressMenu: true,unSortIcon: true,
      valueGetter: (params) => params.data.formattedData['WOS %'] },
  ];
  mapData: ShrinkBySites[] = [];

  constructor(public shrinkVisibilityService: ShrinkVisibilityService,
              public siteApiResponseService:SiteApiResponseService,
              public commonService:CommonService) {
  }

  ngOnInit() {
    this.getEventsBySites();
  }

  getEventsBySites() {
    this.isLoading = true;
    this.shrinkBySites$ = this.shrinkVisibilityService.getShrinkEventBySitesData().subscribe((res: ShrinkBySites[]) => {
      if (res) {
        this.shrinkEventsBySite = res.map(item => {
          return {
            ...item,
            formattedData: this.generateFormattedData(item),
          };
        });        this.shrinkEventsBySite.forEach((item, index) => {
          item["site-name"] = this.siteApiResponseService.getSiteNameBySiteCode(item["site-code"])
        });
        this.mapData = [];
        this.shrinkEventsBySite.forEach((item) => {
          this.siteCoordinate = this.siteApiResponseService.getGeoLocationBySiteName(item["site-name"] ?? '');
          this.coordinates.push(this.siteCoordinate);
          this.mapData.push({
            "site-code": item["site-code"] ?? '',
            "shrink-event-count": item["shrink-event-count"],
            "shrink-item-ratio": item["shrink-item-ratio"],
            "bulk-event-ratio": item["bulk-event-ratio"],
            "shrink-event-trend": item["shrink-event-trend"],
            "site-name": item["site-name"],
            "coordinates": this.siteCoordinate
          });
        });
      }
      this.isLoading = false;
    })
  }

  onToggleClick(event: string) {
    if (event) {
      this.viewType = event;
    }
  }

  generateFormattedData(item: ShrinkBySites) {
    const formattedData: any = {};
    formattedData["Site ID"] = item["site-code"];
    formattedData["Site Name"] = item["site-name"];
    formattedData["Shrink Events"] = item["shrink-event-count"];
    formattedData["% Bulk Events"] = (item["bulk-event-ratio"]* 100).toFixed(2);
    formattedData["% Change in Shrink"] = item["shrink-event-trend"];
    formattedData["WOS %"] = (item["shrink-item-ratio"]* 100).toFixed(2);
    return formattedData;
  }

  downloadFile(_event: string) {
    const startDate = this.commonService.startDate;
    const endDate = this.commonService.endDate;
    let filteredData: ShrinkBySites[] = [];
    if (this.viewType === 'table') {
      filteredData = this.shrinkEventsBySite.map((item) => {
        return this.generateFormattedData(item);
      });
      const fileName = 'Highest_Shrink_By_Sites';
      this.commonService.downloadFile(filteredData, fileName, startDate, endDate);
    }
    else if(this.viewType === 'chart'){
      this.commonService.downloadChartAsPDF(this.chartId,'highest-shrink-chart',startDate,endDate);
    }
    else if(this.viewType === 'map'){
      this.commonService.downloadMapAsPDF(this.mapId,'highest_shrink_map',startDate,endDate);
    }
  }

  getChartId(event: string){
    this.chartId = event;
  }

  getMapId(event: string){
    this.mapId = event;
  }

  ngOnDestroy(): void {
    if (this.shrinkBySites$) {
      this.shrinkBySites$.unsubscribe()
    }
    if (this.refreshEvent$) {
      this.refreshEvent$.unsubscribe()
    }
  }
}
