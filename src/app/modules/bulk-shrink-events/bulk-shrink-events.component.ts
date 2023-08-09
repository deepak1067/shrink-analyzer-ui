import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { BulkShrinkEventsService } from '../../core/services/bulk-shrink-events/bulk-shrink-events.service';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { SiteApiResponseService } from 'src/app/core/services/site-api-response.service';
import { BulkShrinkEvents } from './bulk-shrink-events.model';
import { ActionColumnComponent } from 'src/app/shared/components/action-column/action-column.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-bulk-shrink-events',
  templateUrl: './bulk-shrink-events.component.html',
  styleUrls: ['./bulk-shrink-events.component.scss']
})
export class BulkShrinkEventsComponent {
  applyFilterSubscription$!: Subscription;
  bulkShrinkEventsSubscription$!: Subscription;
  bulkShrinkEvents: BulkShrinkEvents[] = [];
  siteCodeMap: Map<string, string> = new Map();
  isLoading = false;
  public bulkColumnDef: (ColDef | ColGroupDef)[] = [
    {field: 'Event ID', headerName: 'Bulk Event ID',  colId: 'BulkID',minWidth:180, filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Event Time', headerName: 'Date/Time', colId: 'Date/Time', minWidth:210, filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Site Code', headerName: 'Site ID', colId: 'SiteID', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Site Name', headerName: 'Site Name', colId: 'Site Name', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Exit Door ID', headerName: 'Exit Door', colId: 'Exit Door',minWidth:210, filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Event Count', headerName: 'Event Count', colId: 'Event Count', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Action', headerName: 'Action', colId: 'Action',cellRenderer: ActionColumnComponent, floatingFilter: false}
  ]


  constructor(private commonService:CommonService,
    public siteApiResponseService: SiteApiResponseService,
    public bulkShrinkEventsService:BulkShrinkEventsService,
    public router: Router
    ){}

  ngOnInit(): void {
    this.commonService.sendPageTitle('BULK SHRINK EVENTS')
    this.getBulkShrinkEventsData();
    this.getFilterAppliedValue();
  }

  getFilterAppliedValue(){
    this.applyFilterSubscription$ = this.commonService
    .getFilterAppliedValue()
    .subscribe((res) => {
      if ((res.applied || res.clearAction) && (res.pageUrl === "/dashboard/bulk-shrink-events")) {
        this.commonService.updateQueryParams();
        this.getBulkShrinkEventsData();
      }
    });
  }
 

  getBulkShrinkEventsData() {
    this.isLoading = true;
    let time = new Date().getTime()/1000;
    this.bulkShrinkEventsSubscription$ = this.bulkShrinkEventsService
      .getBulkEvents()
      .subscribe((res: BulkShrinkEvents[]) => {
        if (res) {
          console.log(" Time for getting the Bulk Data " +
            ((new Date().getTime() / 1000) - time) + "seconds");
          this.bulkShrinkEvents = [...res];
          this.bulkShrinkEvents.forEach((item) => {
            item["Site Name"] =
              this.siteApiResponseService.getSiteNameBySiteCode(
                item["Site Code"]
              );
          });
          this.commonService.setTotalBulkEventCount(this.bulkShrinkEvents.length)
        }
        this.isLoading = false;
      });
  }

  downloadCsvFile() {
    const filteredData = this.bulkShrinkEvents.map((item) => {
      return this.generateFormattedData(item);
    });

    let url = this.router.url;
    let fileName = '';
    if (url.endsWith('/bulk-shrink-events')) {
      fileName = 'Bulk_shrink';
    } else if (url.includes('/bulk-shrink-events?day=')) {
      fileName = 'Bulk_shrink_day_of_the_week';
    } else if (url.includes('/bulk-shrink-events?hour=')) {
      fileName = 'Bulk_shrink_hours_of_the_day';
    }
    this.commonService.downloadFile(filteredData, fileName, this.commonService.startDate, this.commonService.endDate);
  }

  generateFormattedData(item: BulkShrinkEvents) {
    const formattedData: any = {};
    formattedData["Bulk Event ID"] = item["Event ID"];
    formattedData["Date/Time"] = item["Event Time"];
    formattedData["Site ID"] = item["Site Code"];
    formattedData["Site Name"] = item["Site Name"];
    formattedData["Exit Door"] = item["Exit Door ID"];
    formattedData["Event Count"] = item["Event Count"];
    formattedData["Assigned Status"] = item["Status"];
    return formattedData;
  }

  ngOnDestroy() {
    if (this.bulkShrinkEventsSubscription$) {
      this.bulkShrinkEventsSubscription$.unsubscribe();
    }
    if (this.applyFilterSubscription$) {
      this.applyFilterSubscription$.unsubscribe();
    }
  }
}
