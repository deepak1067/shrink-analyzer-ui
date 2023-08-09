import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShrinkVisibilityRoutingModule } from "./shrink-visibility-routing.module";
import { MaterialModule } from "src/app/shared/module/material.module";
import { HighestShrinkBySitesComponent } from "./highest-shrink-by-sites/highest-shrink-by-sites.component";
import { ShrinkEventComponent } from "./shrink-event/shrink-event.component";
import { ShrinkByRollUpComponent } from "./shrink-by-roll-up/shrink-by-roll-up.component";
import { ShrinkTabBarComponent } from "./shrink-tab-bar/shrink-tab-bar.component";
import { ShrinkVisibilityComponent } from "./shrink-visibility.component";
import { SharedModule } from "src/app/shared/shared.module";
import {AgGridModule} from "ag-grid-angular";
import {
  HighestShrinkBarChartComponent
} from "../../shared/components/highest-shrink-bar-chart/highest-shrink-bar-chart.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ShrinkVisibilityComponent,
    ShrinkEventComponent,
    ShrinkByRollUpComponent,
    HighestShrinkBySitesComponent,
    ShrinkTabBarComponent,
    HighestShrinkBarChartComponent
  ],
  imports: [
    CommonModule,
    ShrinkVisibilityRoutingModule,
    MaterialModule,
    SharedModule,
    AgGridModule,
    FormsModule
  ]
})
export class ShrinkVisibilityModule {}
