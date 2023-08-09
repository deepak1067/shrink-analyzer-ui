import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpcReadListRoutingModule } from './epc-read-list-routing.module';
import { EpcReadListComponent } from './epc-read-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/module/material.module';


@NgModule({
  declarations: [
    EpcReadListComponent],
  imports: [
    CommonModule,
    EpcReadListRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class EpcReadListModule { }
