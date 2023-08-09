import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementPerformanceRoutingModule } from './management-performance-routing.module';
import { ManagementPerformanceComponent } from './management-performance.component';


@NgModule({
  declarations: [
    ManagementPerformanceComponent
  ],
  imports: [
    CommonModule,
    ManagementPerformanceRoutingModule
  ]
})
export class ManagementPerformanceModule { }
