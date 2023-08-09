import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject, Subscription, take, takeUntil} from "rxjs";
import {ShrinkVisibilityService} from "src/app/core/services/shrink-visibility/shrink-visibility.service";
import {ColDef, ColGroupDef} from "ag-grid-community";
import {ShrinkEventsByProductAttributes} from "../shrink-visibility.model";
import {ActivatedRoute, Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {getCurrencySymbol} from "@angular/common";
import {CommonService} from '../../../shared/services/common.service';

@Component({
  selector: "app-shrink-by-roll-up",
  templateUrl: "./shrink-by-roll-up.component.html",
  styleUrls: ["./shrink-by-roll-up.component.scss"],
})
export class ShrinkByRollUpComponent implements OnInit, OnDestroy {
  viewType: string = "chart";
  selectedValue: string = "";
  productAttributes: string[] = [];
  productAttributeSubscription!: Subscription;
  shrinkEventsByProductAttributes: ShrinkEventsByProductAttributes[] = [];
  shrinkEventsSubscription!: Subscription;
  rollUpColumnDef: (ColDef | ColGroupDef)[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();
  chartId!: string;

  constructor(
    public shrinkVisibilityService: ShrinkVisibilityService,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.getProductAttributes()
      .pipe(
        tap(() => {
          this.route.queryParams
            .pipe(take(1), takeUntil(this.unsubscribe$))
            .subscribe((params) => {
              const attribute = params["attribute"];
              if (!attribute) {
                this.setQueryParamsAndLoadData(this.selectedValue);
              } else {
                this.setQueryParamsAndLoadData(attribute);
              }
            });
        })
      )
      .subscribe();
  }

  getProductAttributes() {
    return this.shrinkVisibilityService.getProductAttributes().pipe(
      tap((res: string[]) => {
        if (res && res.length > 0) {
          this.productAttributes = [...res];
          this.selectedValue = this.productAttributes[0];
        }
      })
    );
  }

  setQueryParamsAndLoadData(attribute: string) {
    this.filterByProductAttribute(attribute);
  }

  generateDynamicColumnDef(attribute: string) {
    this.rollUpColumnDef = [
      { field: 'Value', headerName: attribute, colId: attribute, filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true,
        valueGetter: (params) => params.data.formattedData[attribute] },
      { field: 'Quantity', headerName: 'Total Shrink Events', colId: 'Quantity', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true,
        valueGetter: (params) => params.data.formattedData['Total Shrink Events'] },
      { field: 'Amount', headerName: 'Total Product Value', colId: 'Amount', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true,
        valueGetter: (params) => params.data.formattedData['Total Product Value'] },
      { field: 'Ratio', headerName: 'Shrink %', colId: 'Currency', filter: 'agTextColumnFilter', suppressMenu: true, unSortIcon: true,
        valueGetter: (params) => params.data.formattedData['Shrink %'] },
    ];
  }

  currencyCellRenderer(params: any) {
    const currencySymbol = getCurrencySymbol(params.data.Currency, "narrow");
    return `${currencySymbol} ${params.value}`;
  }

  getShrinkEventsData(attribute: string) {
    this.shrinkEventsSubscription = this.shrinkVisibilityService
      .getShrinkEventsByProductAttributeData(attribute)
      .subscribe((res: ShrinkEventsByProductAttributes[]) => {
        this.shrinkEventsByProductAttributes = res.map(item => {
          return {
            ...item,
            formattedData: this.generateFormattedData(item),
          };
        });
      });
  }

  onToggleClick(event: string) {
    if (event) {
      this.viewType = event;
    }
  }

  downloadFile(_event: string) {
    const startDate = this.commonService.startDate;
    const endDate = this.commonService.endDate;
    const fileName = `Rollup_by_${this.selectedValue}`;
    if (this.viewType === 'table') {
      const filteredData = this.shrinkEventsByProductAttributes.map((item) => {
        return this.generateFormattedData(item);
      });
      this.commonService.downloadFile(filteredData, fileName, startDate, endDate);
    } else if (this.viewType === 'chart') {
      this.commonService.downloadChartAsPDF(this.chartId, fileName, startDate, endDate);
    }
  }

  getChartId(event: string) {
    this.chartId = event;
  }

  generateFormattedData(item: ShrinkEventsByProductAttributes) {
    const formattedData: any = {};
    formattedData[this.selectedValue] = item.Value;
    formattedData["Total Shrink Events"] = item.Quantity;
    formattedData["Total Product Value"] = this.currencyCellRenderer({data: {Currency: item.Currency}, value: item.Amount});
    formattedData["Shrink %"] = (item.Ratio * 100).toFixed(2);
    return formattedData;
  }

  filterByProductAttribute(attribute: string) {
    this.selectedValue = attribute;
    this.generateDynamicColumnDef(attribute);
    this.getShrinkEventsData(attribute);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {attribute},
      queryParamsHandling: "merge",
    });
  }

  ngOnDestroy() {
    this.productAttributeSubscription?.unsubscribe();
    this.shrinkEventsSubscription?.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
