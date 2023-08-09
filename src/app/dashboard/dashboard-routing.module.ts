import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ApiErrorComponent } from './components/api-error/api-error.component';

const routes: Routes = [
 {
  path: '',
  component:DashboardComponent,
  children: [
  {
    path: '',
    loadChildren: () => import('../modules/shrink-visibility/shrink-visibility.module').then((m) => m.ShrinkVisibilityModule),
  },
  {
    path:'bulk-shrink-events',
    loadChildren: () => import('../modules/bulk-shrink-events/bulk-shrink-events.module').then((m) => m.BulkShrinkEventsModule)
  },
  {
    path:'rfid-exit-read',
    loadChildren: () => import('../modules/rfid-exit-read/rfid-exit-read.module').then((m) => m.RfidExitReadModule),
  },
  {
    path:'epc-read-list',
    loadChildren: () => import('../modules/epc-read-list/epc-read-list.module').then((m) => m.EpcReadListModule),
  },
  {
    path:'management-performance',
    loadChildren: () => import('../modules/management-performance/management-performance.module').then((m) => m.ManagementPerformanceModule)
  },
  {
    path: 'api-error',
    component: ApiErrorComponent
  },
  {
    path: 'server-error',
    component: ServerErrorComponent
  },
],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
