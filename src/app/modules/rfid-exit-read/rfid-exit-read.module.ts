import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfidExitReadRoutingModule } from './rfid-exit-read-routing.module';
import { RFIDExitReadComponent } from './rfid-exit-read.component';


@NgModule({
  declarations: [
    RFIDExitReadComponent
  ],
  imports: [
    CommonModule,
    RfidExitReadRoutingModule
  ]
})
export class RfidExitReadModule { }
