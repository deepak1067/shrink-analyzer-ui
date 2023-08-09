import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { ShrinkVisibilityService } from "../../core/services/shrink-visibility/shrink-visibility.service";
import { SiteApiResponseService } from "../../core/services/site-api-response.service";
import { EpcReadListService } from "../../core/services/epc-read-list/epc-read-list.service";
import { EPCReadList } from "./epc-read-list.model";
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: "app-epc-read-list",
  templateUrl: "./epc-read-list.component.html",
  styleUrls: ["./epc-read-list.component.scss"],
})
export class EpcReadListComponent {
  applyFilterSubscription$!: Subscription;
  productAttributeSubscription$!: Subscription;
  productAttributeList: string[] = [];
  epcReadListSubscription$!: Subscription;
  epcReadList: EPCReadList[] = [];
  siteCodeMap: Map<string, string> = new Map();
  isLoading = false;
  public epcColumnDef: (ColDef | ColGroupDef)[] = [
    {field: 'EPC', headerName: 'EPC', minWidth:180,  colId: 'EPC',filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Site Code', headerName: 'SiteID',minWidth:140,  colId: 'SiteID', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Site Name', headerName: 'Site Name',minWidth:200,  colId: 'Site Name', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Event Time', headerName: 'Date/Time',minWidth:210,  colId: 'Event Time', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Read Point', headerName: 'Read Point',minWidth:150,  colId: 'Read Point', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
    {field: 'Last Read Time', headerName: 'Prior Read Time',minWidth:210, colId: 'Prior Read Time', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true},
  ]

  constructor(
    public shrinkVisibilityService: ShrinkVisibilityService,
    public siteApiResponseService: SiteApiResponseService,
    public epcReadListService: EpcReadListService,
    public commonService:CommonService
  ) {}

  ngOnInit() {
    this.commonService.sendPageTitle('EPC Read List')
    this.getDynamicAttributeColumns();
    this.getEpcData();
    this.getFilterAppliedValue();
  }

  getFilterAppliedValue(){
    this.applyFilterSubscription$ = this.commonService
    .getFilterAppliedValue()
    .subscribe((res) => {
      if ((res.applied || res.clearAction) && (res.pageUrl === "/dashboard/epc-read-list")) {
        this.commonService.updateQueryParams();
        this.getEpcData();
      }
    });
  }

  getDynamicAttributeColumns(): void {
    this.productAttributeSubscription$ = this.shrinkVisibilityService
      .getProductAttributes()
      .subscribe((res: string[]) => {
        if (res) {
          this.productAttributeList = [...res];
          this.updateDynamicColumns();
        }
      });
  }

  updateDynamicColumns(): void {
    const dynamicColumns: (ColDef | ColGroupDef)[] = [];
    this.productAttributeList.forEach((item) => {
      const colDef: ColDef = {
        headerName: item,
        field: item,
        colId: item,
        filter: "agTextColumnFilter",
        minWidth: 120,
        suppressMenu: true,
        unSortIcon: true,
      };
      dynamicColumns.push(colDef);
    });
    this.epcColumnDef = [...this.epcColumnDef, ...dynamicColumns];
  }

  getEpcData() {
    let time = new Date().getTime() / 1000;
    this.isLoading = true;
    this.epcReadListSubscription$ = this.epcReadListService
      .getEPCReadList()
      .subscribe((res: EPCReadList[]) => {
        if (res) {
          this.epcReadList = [...res];
            console.log(" time for getting the epc read list " +
                ((new Date().getTime() / 1000) - time) + "seconds");
          this.epcReadList.forEach((item) => {
            item["Site Name"] =
              this.siteApiResponseService.getSiteNameBySiteCode(
                item["Site Code"]
              );
          });
        }
        this.isLoading = false;
      });
  }


  downloadCSVFile ()
  {
    const dynamicColumns = this.productAttributeList;
     const filteredData = this.epcReadList.map((item) => {
         return this.generateFormattedData(item, dynamicColumns);
     });
    const fileName = 'Epc_read_list';
   this.commonService.downloadFile(filteredData, fileName, this.commonService.startDate, this.commonService.endDate);
  }
  
  generateFormattedData(item: EPCReadList, dynamicColumns: string[]) {
     const formattedData: any = {};
     formattedData["EPC"] = item.EPC;
     formattedData["SiteID"] = item["Site Code"];
     formattedData["Site Name"] = item["Site Name"];
     formattedData["Date/Time"] = item["Event Time"];
     formattedData["Read Point"] = item["Read Point"];
     formattedData["Prior Read Time"] = item["Last Read Time"];
     dynamicColumns.forEach((attr) => {
         formattedData[attr] = item.hasOwnProperty(attr) ? item[attr] ?? '' : '';
     });
     return formattedData;
  }

  ngOnDestroy() {
    if (this.productAttributeSubscription$) {
      this.productAttributeSubscription$.unsubscribe();
    }
    if (this.epcReadListSubscription$) {
      this.epcReadListSubscription$.unsubscribe();
    }
    if (this.applyFilterSubscription$) {
      this.applyFilterSubscription$.unsubscribe();
    }
  }
}
