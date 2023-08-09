import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import {  MaterialModule } from '../shared/module/material.module';
import { FilterComponent } from './components/filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiErrorComponent } from './components/api-error/api-error.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import {TranslateModule} from "@ngx-translate/core";
import { UserPreferencesDialogComponent } from './components/user-preferences-dialog/user-preferences-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidenavComponent,
    HeaderComponent,
    FilterComponent,
    ApiErrorComponent,
    ServerErrorComponent,
    SubHeaderComponent,
    UserPreferencesDialogComponent,
  ],
  exports: [
    HeaderComponent,
    ApiErrorComponent
  ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
    ]
})
export class DashboardModule {
}
