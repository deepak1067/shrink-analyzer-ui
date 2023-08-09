import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ShrinkEventComponent } from './shrink-event/shrink-event.component';
import { HighestShrinkBySitesComponent } from './highest-shrink-by-sites/highest-shrink-by-sites.component';
import { ShrinkByRollUpComponent } from './shrink-by-roll-up/shrink-by-roll-up.component';
import { ShrinkVisibilityComponent } from './shrink-visibility.component';

const routes: Routes = [
  {
    path: '',
    component: ShrinkVisibilityComponent,
    children: [
      {
        path: '',
        component: ShrinkEventComponent,
      },
      {
        path: 'shrink-by-roll-up',
        component: ShrinkByRollUpComponent,
      }, 
      {
        path: 'highest-shrink-by-site',
        component: HighestShrinkBySitesComponent,
      },

    ],
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShrinkVisibilityRoutingModule { }
