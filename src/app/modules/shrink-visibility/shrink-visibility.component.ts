import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DatePipe, getCurrencySymbol} from "@angular/common";
import {Subscription} from "rxjs";
import {Card, ShrinkDataRefresh} from "./shrink-visibility.model";
import {ShrinkVisibilityService} from "../../core/services/shrink-visibility/shrink-visibility.service";
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from "../../core/services/auth.service";
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-shrink-visibility',
  templateUrl: './shrink-visibility.component.html',
  styleUrls: ['./shrink-visibility.component.scss'],
  providers: [DatePipe]
})
export class ShrinkVisibilityComponent implements OnInit, OnDestroy {

  cards: Card[] = [];
  lastShrinkDataRefreshed!: string | null;
  lastPosUploaded!: string | null;
  subscription!: Subscription;
  refreshEventSubscription$!: Subscription;

  constructor(
    public router: Router,
    public datePipe: DatePipe,
    public service: ShrinkVisibilityService,
    public authService: AuthService,
    public dialog: MatDialog,
    public commonService:CommonService) {
  }

  ngOnInit() {
    this.commonService.sendPageTitle('SHRINK VISIBILITY')
    this.getCardsData();
    this.getRefreshData();
    }

  getRefreshData(){
    this.refreshEventSubscription$ = this.commonService.getRefreshClick()
      .subscribe((res) => {
        if (res){
          this.getCardsData()
        }
      });
 }

  getCardsData() {
    this.setDefaultCardData();
    this.subscription = this.service.getCardsData().subscribe({
      next: (data) => {
        if (data) {
          this.cards = [
            {
              text: 'Without Sale %',
              results: (data['shrink-item-ratio'] * 100).toFixed(2)
            },
            {
              text: 'Total Shrink Value',
              results: data['shrink-value'].amount,
              currency: getCurrencySymbol(data['shrink-value'].currency, 'narrow')
            },
            {
              text: 'Bulk Shrink Events %',
              results: (data['shrink-event-bulk-ratio'] * 100).toFixed(2)
            },
            {
              text: 'Total Exit Reads',
              results: data['exit-items'].count,
              trend: data['exit-items'].trend
            }
          ];
          const lastPosUploadedTime = data.refresh['last-pos-event-time'] * 1000;
          const lastRefreshTime = data.refresh['last-exit-event-time'] * 1000;
          this.lastPosUploaded = this.datePipe.transform(new Date(lastPosUploadedTime), 'yyyy-dd-MM hh:mm:ss');
          this.lastShrinkDataRefreshed = this.datePipe.transform(new Date(lastRefreshTime), 'yyyy-dd-MM hh:mm:ss');
          const lastRefreshData:ShrinkDataRefresh={
            lastShrinkDataRefreshed: this.lastPosUploaded ,
            lastPosUploaded: this.lastShrinkDataRefreshed 
          }
          this.commonService.sendShrinkDataRefresh(lastRefreshData)
        }
      },
      error: (error: any) => {
        console.error('Error fetching data from API:', error);
      }
    });
  }

  setDefaultCardData() {
    this.cards = [
      {
        text: 'Without Sale %',
        results: '...'
      },
      {
        text: 'Total Shrink Value',
        results: '...',
        currency: ''
      },
      {
        text: 'Bulk Shrink Events %',
        results: '...'
      },
      {
        text: 'Total Exit Reads',
        results: '...',
        trend: 0
      }
    ];
  }

  routeSideNav(cardText: string) {
    if (cardText === 'Without Sale %' || cardText === 'Total Shrink Value' || cardText === 'Total Exit Reads') {
      this.router.navigateByUrl('/dashboard/rfid-exit-read');
    } else if (cardText === 'Bulk Shrink Events %') {
      this.router.navigateByUrl('/dashboard/bulk-shrink-events');
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
