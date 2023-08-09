import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ShrinkEventsByProductAttributes} from '../../../modules/shrink-visibility/shrink-visibility.model';
import {getCurrencySymbol} from '@angular/common';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-roll-up-bar-chart',
  templateUrl: './roll-up-bar-chart.component.html',
  styleUrls: ['./roll-up-bar-chart.component.scss']
})
export class RollUpBarChartComponent implements OnChanges {
  @Input() barChartData: ShrinkEventsByProductAttributes[] = [];
  @Input() selected: string = '';
  @Output() sendChartId: EventEmitter<string> = new EventEmitter<string>();

  constructor(private commonService: CommonService) {
  }

  ngOnChanges() {
    if (this.barChartData.length) {
      this.createChartColumn();
    }
  }

  createChartColumn(): void {
    const xAxisCategories = this.barChartData.map((data) => data['Value']);
    const seriesData = [
      {
        name: this.selected,
        data: this.barChartData.map((data) => ({
          value: data.Value,
          y: parseFloat(String(data.Quantity)),
          symbol: getCurrencySymbol(data['Currency'], 'narrow'),
          currencyCode: data.Currency,
          currency: parseFloat(String(data.Amount)),
        })),
        color: '#00B7A8',
        showInLegend: false,
      },
    ];
    const tooltipHeader = `
      <tr><td style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat';">{series.name}</td>
      <td style="color:#333333; font-size:12px; padding-left:20px;text-align: right;font-family: 'Montserrat'"><b>{point.value}</b></td></tr>
      <tr><td style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat'">Qty</td>
      <td style="color:#333333; font-size:12px; padding-left:20px;text-align: right;font-family: 'Montserrat'"><b>{point.y}</b></td></tr>
      <tr><td style="color:#666666; padding:3px; font-size:12px;font-family: 'Montserrat'">Product Value</td>
      <td style="color:#333333; font-size:12px; padding-left:20px;text-align: right;font-family: 'Montserrat'"><b>{point.symbol} {point.currency}</b></td></tr>
    `;

    const plotOptions = {
      column: {
        pointPadding: 100,
        borderWidth: 0,
        borderRadius: 10,
        pointWidth: 15,
      },
      series: {
        marker: {
          width: 0
        },
      }
    };

    this.commonService.createChartColumn('rollUpBarChart', xAxisCategories, seriesData, tooltipHeader, plotOptions);
    this.sendChartId.emit('rollUpBarChart');
  }
}
