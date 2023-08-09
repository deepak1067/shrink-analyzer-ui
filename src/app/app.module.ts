import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatePipe} from '@angular/common';
import {CookieModule} from 'ngx-cookie';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AgGridModule} from "ag-grid-angular";
import { AuthProcessComponent } from './core/components/auth/auth-process/auth-process.component';
import { AuthVerifyComponent } from './core/components/auth/auth-verify/auth-verify.component';
import { httpInterceptorProviders } from './core/http-interceptors';
import { MaterialModule } from './shared/module/material.module';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import {DashboardModule} from "./dashboard/dashboard.module";
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function initializeApp(translate: TranslateService) {
  return (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const defaultLanguage = 'en';
      const supportedLanguages = ['en', 'es', 'fr', 'it', 'ja'];
      const browserLanguage = window.navigator.language.toLowerCase();

      let selectedLanguage = localStorage.getItem('selectedLanguage');

      if (!selectedLanguage || !supportedLanguages.includes(selectedLanguage)) {
        selectedLanguage = supportedLanguages.includes(browserLanguage) ? browserLanguage : defaultLanguage;
      }
      translate.setDefaultLang(defaultLanguage);
      translate.use(selectedLanguage).subscribe(() => {
        resolve();
      });
    });
  };
}
@NgModule({
  declarations: [
    AppComponent,
    AuthVerifyComponent,
    AuthProcessComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(), // NOSONAR
    AgGridModule,
    MaterialModule,
    DashboardModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
   {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [TranslateService],
    multi: true,
   },
      DatePipe, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
  }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
