import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { MaterialModule } from './module/material.module';
import { FormsModule } from '@angular/forms';
import { ShrinkBarChartComponent } from './components/shrink-bar-chart/shrink-bar-chart.component';
import { AgGridModule } from 'ag-grid-angular';
import { MapViewComponent } from './components/map-view/map-view.component';
import { TabularViewComponent } from './components/tabular-view/tabular-view.component';
import { RollUpBarChartComponent } from './components/roll-up-bar-chart/roll-up-bar-chart.component';
import { ActionColumnComponent } from './components/action-column/action-column.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    ShrinkBarChartComponent,
    ToggleButtonComponent,
    TabularViewComponent,
    MapViewComponent,
    RollUpBarChartComponent,
    ActionColumnComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    ShrinkBarChartComponent,
    ToggleButtonComponent,
    TabularViewComponent,
    MapViewComponent,
    RollUpBarChartComponent,
    ActionColumnComponent,
    TranslateModule
  ]
})
export class SharedModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}