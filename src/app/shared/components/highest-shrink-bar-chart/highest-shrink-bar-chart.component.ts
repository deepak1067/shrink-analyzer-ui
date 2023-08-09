import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ShrinkBySites} from '../../../modules/shrink-visibility/shrink-visibility.model';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-highest-shrink-bar-chart',
  templateUrl: './highest-shrink-bar-chart.component.html',
  styleUrls: ['./highest-shrink-bar-chart.component.scss']
})
export class HighestShrinkBarChartComponent {
  @Input() barChartData: ShrinkBySites[] = [];
  @Output() sendChartId: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router, private commonService: CommonService) {
  }

  ngOnChanges() {
    if (this.barChartData.length) {
      this.createChartColumn();
    }
  }

  createChartColumn(): void {
    const xAxisCategories = this.barChartData.map((data) => data['site-code']);
    const seriesData = [
      {
        name: 'Total Shrink Items',
        data: this.barChartData.map((data) => ({
          y: data['shrink-event-count'],
          shrinkItemRatio: (data['shrink-item-ratio'] * 100).toFixed(2),
          bulkEventRatio: (data['bulk-event-ratio'] * 100).toFixed(2),
          siteName: data['site-name'],
          events: {
            click: (event: any) => {
              this.navigateToPage(event.point.category, event.point.y, 'Total Shrink Items');
            },
          },
        })),
        color: '#4C9AF0',
        cursor: 'pointer',
        showInLegend: false,
      },
    ];
    const tooltipHeader = `
      <th style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat'"><b>{point.siteName}</b></th>
      <tr><td style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat';">{series.name}</td>
      <td style="color:#333333; font-size:12px; padding-left:20px;text-align: right;font-family: 'Montserrat'"><b>{point.y}</b></td></tr>
      <tr><td style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat'">Bulk Events</td>
      <td style="color:#333333; font-size:12px; padding-left:20px;text-align: right;font-family: 'Montserrat'"><b>{point.bulkEventRatio}</b></td></tr>
      <tr><td style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat'">% Change in shrink</td>
      <td style="color:#333333; font-size:12px; padding-left:20px;text-align: right;font-family: 'Montserrat'"><b>{point.shrinkItemRatio}%</b></td></tr>
    `;

    const plotOptions = {
      column: {
        pointPadding: 100,
        borderWidth: 0,
        borderRadius: 15,
        pointWidth: 30,
      },
      series: {
        marker: {
          width: 0
        },
      }
    }

    this.commonService.createChartColumn('shrinkBarChart', xAxisCategories, seriesData, tooltipHeader, plotOptions);
    this.sendChartId.emit('shrinkBarChart');
  }

  navigateToPage(xAxis: string, yAxis: number, data: string) {
    if (data === 'Total Shrink Items') {
      this.router.navigate(['dashboard/rfid-exit-read'], {queryParams: {["site-code"]: xAxis}})
    }
  }
}
