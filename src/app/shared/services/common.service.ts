import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FilterChange, FilterFields, ShrinkDataRefresh} from 'src/app/modules/shrink-visibility/shrink-visibility.model';
import {saveAs} from "file-saver";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {map} from "rxjs/operators";
import {AuthService} from 'src/app/core/services/auth.service';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {CookieService} from 'ngx-cookie';
import {environment} from 'src/environments/environment';
import * as Highcharts from "highcharts";
import * as Papa from 'papaparse';
import {datadogLogs, LogsEvent, StatusType} from "@datadog/browser-logs";
import {datadogRum} from "@datadog/browser-rum";


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  queryParams: any = {};
  startDate!: string | null;
  endDate!: string | null;
  isFilter!: boolean;
  sendRefreshEvent$ = new Subject<boolean>();
  shrinkDataRefresh$ = new Subject<ShrinkDataRefresh>();
  filterChange$ = new Subject<FilterChange>();
  getPageTitle$ = new Subject<string>();
  getBulkEventCount$ = new Subject<number>();

  constructor(private authService:AuthService,
    private http: HttpClient,
    public datePipe: DatePipe,
    private cookieService: CookieService) {
      this.setDefaultDateRange()
     }


    setDefaultDateRange() {
      this.startDate = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6), 'yyyyMMdd');
      this.endDate = this.datePipe.transform(new Date(), 'yyyyMMdd');
    }
  
    setDefaultQueryParams() {
      this.queryParams = {
        "tenant-id": this.cookieService.get("resTenantId"),
        "start-date": this.startDate,
        "end-date": this.endDate,
        'start-time': 0,
        'end-time': 0,
        'site-code': [],
        'site-name': [],
        'site-label': [],
        'include-not-in-catalog': false,
        "site-directory": [],
        "event-label": [],
        "bulk-tags": [],
        "epc": '',
        "key": environment.api.routes.apis.dataKey,
      };
    }
  
     updateQueryParams() {
      const filterValuesString = localStorage.getItem("filterValues");
      if (!filterValuesString) {
        this.setDefaultDateRange();
        this.setDefaultQueryParams();
      } else {
        const filterValues: FilterFields = JSON.parse(filterValuesString);
        this.isFilter = localStorage.getItem('isFilterApplied') !== 'false';
  
        if (this.isFilter) {
          this.startDate = filterValues['start-date'] ? filterValues['start-date'] : this.getDefaultStartDate();
          this.endDate = filterValues['end-date'] ? filterValues['end-date'] : this.getDefaultEndDate();
  
          let startHour = filterValues["start-time"] ?? 0;
          let endHour = filterValues["end-time"] ?? 0;
  
          this.queryParams = {
            "tenant-id": this.cookieService.get("resTenantId"),
            "start-date": this.startDate,
            "end-date": this.endDate,
            "start-time": startHour,
            "end-time": endHour,
            "site-code": filterValues["site-code"],
            "site-name": filterValues["site-name"],
            "site-label": filterValues["site-label"],
            "site-directory": filterValues["site-directory"],
            "event-label": filterValues["event-label"],
            "bulk-tags": filterValues["bulk-tags"],
            'itemLabel': filterValues["itemLabel"],
            "include-not-in-catalog": filterValues["include-not-in-catalog"],
            "epc": filterValues["epc"],
            "key": environment.api.routes.apis.dataKey,
          };
        } else {
          this.setDefaultDateRange();
          this.setDefaultQueryParams();
        }
      }
    }
  
    getDefaultStartDate(): string {
      return <string>this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 6), 'yyyyMMdd');
    }
  
    getDefaultEndDate(): string {
      return <string>this.datePipe.transform(new Date(), 'yyyyMMdd');
    }

  convertCSVToJsonWithQuotes(data: any) {
    const rows = data.split('\n');
    const headers = rows[0].split(',').map((header: string) => this.removeQuotes(header.trim()));
    rows.shift();
    return rows.map((row: string) => {
      const values = row.split(',').map((value: string) => this.removeQuotes(value.trim()));
      const rowObject = [];
      for (let i = 0; i < headers.length; i++) {
        rowObject[headers[i]] = values[i];
      }
      return rowObject;
    });
  }

  removeQuotes(value: string): string {
    return value.replace(/^"(.*)"$/, '$1');
  }
  parseCsvData(url: string): Observable<any> {
    const options = this.authService.getAuthHttpOptions();
    const time = new Date().getTime() / 1000;
    return this.http.get(url, {...options, responseType: 'text'}).pipe(
      map((responseText: string) => {
        datadogLogs.logger.info('Initial time:' + time + '  ---- Time for Getting response ' + ((new Date().getTime() / 1000) - time) + "seconds")
        console.log('Initial time:' + time + '  ---- Time for Getting response ' + ((new Date().getTime() / 1000) - time) + "seconds");
        const time2 = new Date().getTime() / 1000;
        const parsedData = Papa.parse(responseText, {header: true, skipEmptyLines: true});
        datadogLogs.logger.info('Initial time:' + time2 + '  ---- Time for Parsing Data ' + ((new Date().getTime() / 1000) - time2) + "seconds")
        console.log('Initial time:' + time2 + '  ---- Time for Parsing Data ' + ((new Date().getTime() / 1000) - time2) + "seconds");
        return parsedData.data;
      })
    );
  }

  buildQueryParams(params: { [key: string]: any }): string {
    return Object.entries(params)
      .filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        } else {
          return value !== undefined && value !== null && value !== '';
        }
      })
      .map(([key, value]) => {
        if ((key === 'start-time' || key === 'end-time') && value === 24) {
          return `${key}=0`;
        } else {
          return `${key}=${encodeURIComponent(value)}`;
        }
      })
      .filter((param) => param !== '')
      .join("&");
  }

  downloadFile(data: any, fileName: string, startDate: string | null, endDate: string | null) {
    const replacer = (key: any, value: null) => value ?? '';
    const header = Object.keys(data[0]);
    let csv = data.map((row: {
      [x: string]: any;
    }) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    const downloadedFileName = `${fileName}_${startDate}_${endDate}.csv`;
    let blob = new Blob(["\uFEFF" + csvArray], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, downloadedFileName);
  }

  downloadChartAsPDF(id: string, fileName: string, startDate: string | null, endDate: string | null) {
    const downloadedFileName = `${fileName}_${startDate}_${endDate}.pdf`;
    let DATA: any = document.getElementById(id);
    html2canvas(DATA).then((canvas: any) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 20;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(downloadedFileName);
    });
  }

  createChartColumn(chartId: string, xAxisCategories: any[], seriesData: any[], tooltipHeader: string, plotOptions: any): void {
    Highcharts.chart(chartId, {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        title: {
          text: ``,
          style: {
            fontWeight: '400',
            fontSize: '12px',
            fontFamily: 'Montserrat',
            lineHeight: '15px',
            letterSpacing: '0px',
            textAlign: 'right',
            color: '#000000',
          },
        },
        categories: xAxisCategories,
        labels: {
          useHTML: true,
          style: {
            fontWeight: '400',
            fontSize: '10px',
            fontFamily: 'Montserrat',
            lineHeight: '15px',
            letterSpacing: '0px',
            textAlign: 'right',
            color: '#000000',
          },
        },
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      responsive: true,
      tooltip: {
        headerFormat: `<table>`,
        pointFormat: tooltipHeader,
        footerFormat: `</table>`,
        shared: true,
        useHTML: true,
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      plotOptions: plotOptions,
      series: seriesData,
      legend: {
        enabled: false,
      },
    } as any);
  }

  downloadMapAsPDF(id: string, name: string, startDate: string| null,endDate: string | null) {
    const downloadedFileName = `${name}_${startDate}_${endDate}.pdf`;   
    let DATA: any = document.getElementById(id);
    const containerWidth = DATA.offsetWidth; 
    DATA.querySelector('img[alt~="Google"]').style.display = 'none';
    Array.prototype.forEach.call(DATA.getElementsByClassName('gmnoprint'), function(element) {
      element.style.display = 'none';
    });
    let options = {
      width: containerWidth,
      height: 500,
      scale: 2,
      useCORS: true
    };
    html2canvas(DATA,options).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p','px','a4');
      pdf.addImage(imageData,'PNG',10,30,425,200);
      pdf.save(downloadedFileName);
    })
    setTimeout(() => {
      Array.prototype.forEach.call(DATA.getElementsByClassName('gmnoprint'), function(element) {
        element.style.display = '';
      });
      DATA.querySelector('img[alt~="Google"]').style.display = '';
      },1000);
    }

  ////Subjects/////
  sendRefreshClick(value: boolean) {
    this.sendRefreshEvent$.next(value);
  }

  getRefreshClick(): Observable<boolean> {
    return this.sendRefreshEvent$.asObservable();
  }

  sendFilterAppliedValue(value:FilterChange) {
    this.filterChange$.next(value);
  }

  getFilterAppliedValue(): Observable<FilterChange> {
    return this.filterChange$.asObservable();
  }

  sendShrinkDataRefresh(value:ShrinkDataRefresh ) {
    this.shrinkDataRefresh$.next(value);
  }

  getShrinkDataRefresh(): Observable<ShrinkDataRefresh> {
    return this.shrinkDataRefresh$.asObservable();
  }

  sendPageTitle(title:string ) {
    this.getPageTitle$.next(title);
  }

  getPageTitle(): Observable<string> {
    return this.getPageTitle$.asObservable();
  }

  setTotalBulkEventCount(count:number ) {
    this.getBulkEventCount$.next(count);
  }

  getTotalBulkEventCount(): Observable<number> {
    return this.getBulkEventCount$.asObservable();
  }

}
