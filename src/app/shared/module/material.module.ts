import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import {MatLineModule, MatNativeDateModule} from "@angular/material/core";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSliderModule} from '@angular/material/slider';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatLineModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSnackBarModule,
    MatSliderModule,
    MatRadioModule,
    MatTooltipModule
  ],
  exports:[
      CommonModule,
      MatTabsModule,
      MatSidenavModule,
      MatListModule,
      MatLineModule,
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatMenuModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
      MatSlideToggleModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatNativeDateModule,
      MatSelectModule,
      MatButtonToggleModule,
      MatCheckboxModule,
      MatAutocompleteModule,
      MatChipsModule,
      MatSliderModule,
      MatRadioModule,
      MatTooltipModule
  ]
})
export class MaterialModule { }
