import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkShrinkEventsRoutingModule } from './bulk-shrink-events-routing.module';
import { BulkShrinkEventsComponent } from './bulk-shrink-events.component';
import { MaterialModule } from 'src/app/shared/module/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BulkShrinkEventsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    BulkShrinkEventsRoutingModule
  ]
})
export class BulkShrinkEventsModule { }
