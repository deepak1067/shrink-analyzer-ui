import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkShrinkEventsComponent } from './bulk-shrink-events.component';

const routes: Routes = [
  {
    path:'',
    component:BulkShrinkEventsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkShrinkEventsRoutingModule { }
