import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  FilterFields,
  ShrinkDataRefresh,
} from "src/app/modules/shrink-visibility/shrink-visibility.model";
import { FilterComponent } from "../filter/filter.component";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { Subscription } from "rxjs";
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: "app-sub-header",
  templateUrl: "./sub-header.component.html",
  styleUrls: ["./sub-header.component.scss"],
})
export class SubHeaderComponent {

  pageTitle = "SHRINK VISIBILITY";
  filterApplied: boolean = false;
  lastShrinkDataRefreshed: string | null = "...";
  lastPosUploaded: string | null = "...";
  startDate!: string | null;
  endDate!: string | null;
  totalBulkEvent!:number 
  applyFilterSubscription$!:Subscription
  pageTitleSubscription$!:Subscription
  totalBulkEventSubscription$!:Subscription

  constructor(
    public datePipe: DatePipe,
    public dialog: MatDialog,
    public router: Router,
    public authService: AuthService,
    public commonService:CommonService
  ) {}

  ngOnInit() {
    this.InitialPageTitle();
    this.getPageTitle();
    this.getBulkEventCount();
    this.applyFilterSubscription$ = this.commonService.getFilterAppliedValue().subscribe((res) => {
      this.filterApplied = res.applied;
      if (this.filterApplied) {
        this.setFilterDates();
      } else {
        this.setDefaultDateRange();
      }
    });

    this.filterApplied = localStorage.getItem("isFilterApplied") == "true";

    if (this.filterApplied) {
      this.setFilterDates();
    } else {
      this.setDefaultDateRange();
    }
   this.getLastShrinkDataRefreshed();
  }

  getLastShrinkDataRefreshed(){
    this.commonService.getShrinkDataRefresh().subscribe((res: ShrinkDataRefresh) => {
      if (res) {
        this.lastPosUploaded = res.lastPosUploaded;
        this.lastShrinkDataRefreshed = res.lastShrinkDataRefreshed;
      }
    });
  }

  InitialPageTitle() {
    if (this.router.url.includes("/bulk-shrink-events")) {
      this.pageTitle = "BULK SHRINK EVENTS";
    } else if (this.router.url.includes("/rfid-exit-read")) {
      this.pageTitle = "RFID Exit Read";
    } else if (this.router.url.includes("/epc-read-list")) {
      this.pageTitle = "EPC Read List";
    } else if (this.router.url.includes("/management-performance")) {
      this.pageTitle = "MANAGEMENT PERFORMANCE";
    } else {
      this.pageTitle = "SHRINK VISIBILITY";
    }
  }

  getPageTitle(){
    this.pageTitleSubscription$ = this.commonService.getPageTitle().subscribe((title:string)=>{
      this.pageTitle = title
    })
  }

  getBulkEventCount(){
   this.totalBulkEventSubscription$ = this.commonService.getTotalBulkEventCount().subscribe((res:number)=>{
      this.totalBulkEvent = res;
    })
  }

  setDefaultDateRange(): void {
    this.startDate = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  setFilterDates() {
    const filterValue: FilterFields = JSON.parse(localStorage.getItem("filterValues") ?? '{}')
    this.startDate = filterValue['start-date'] ? filterValue['start-date'] : this.datePipe.transform(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6), 'yyyy-MM-dd');
    this.endDate = filterValue['end-date'] ? filterValue['end-date'] :
        this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  refreshData() {
    this.lastPosUploaded = "...";
    this.lastShrinkDataRefreshed = "...";
    this.commonService.sendRefreshClick(true);
    this.authService.getSiteData();
  }

  onFilterClick() {
    this.dialog
      .open(FilterComponent, {
        height: "70%",
        maxWidth: "100vw",
      })
      .afterClosed()
      .subscribe(() => {
        let currentURL = this.router.url;
        if (
          currentURL === "/dashboard" ||
          currentURL.includes("/highest-shrink-by-site") ||
          currentURL.includes("/shrink-by-roll-up")
        ) {
          this.router.navigate(["/dashboard"]);
        }
        else if(currentURL === '/dashboard/api-error'){
          window.history.go(-1);
        }
      });
  }

  ngOnDestroy(): void {
    if(this.applyFilterSubscription$){
      this.applyFilterSubscription$.unsubscribe();
    }
    if(this.pageTitleSubscription$){
      this.pageTitleSubscription$.unsubscribe();
    }
    if(this.totalBulkEventSubscription$){
      this.totalBulkEventSubscription$.unsubscribe();
    }
  }
}

