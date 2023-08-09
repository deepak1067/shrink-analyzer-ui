import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpcReadListComponent } from './epc-read-list.component';

const routes: Routes = [
  {
    path:'',
    component:EpcReadListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpcReadListRoutingModule { }
