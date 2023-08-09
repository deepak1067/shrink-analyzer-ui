import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  ShrinkBySites, ShrinkEventsByProductAttributes,
  ShrinkEventsData,
  ShrinkVisibility
} from '../../../modules/shrink-visibility/shrink-visibility.model';
import {AuthService} from '../auth.service';
import {CookieService} from 'ngx-cookie';
import {environment} from '../../../../environments/environment';
import { CommonService } from '../../../shared/services/common.service';

@Injectable({
  providedIn: "root",
})
export class ShrinkVisibilityService {
  private cardUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getShrinkVisibility}`;
  private getShrinkEventsByDayUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getDaysOfWeekData}`;
  private getHoursOfTheDay = `${environment.api.baseUrl}${environment.api.routes.apis.getHoursOfTheDayData}`;
  private shrinkEventsBySitesUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getShrinkEventsBySites}`;
  public productAttributeUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getProductAttributes}`;
  public shrinkEventsByProductAttributeUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getShrinkEventsByProductAttribute}`;

  options = this.authService.getAuthHttpOptions();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private commonService:CommonService,
    private cookieService: CookieService,
  ) {
  }

  getCardsData(): Observable<ShrinkVisibility | null> {
    if (environment.useDataKey) {
      this.commonService.updateQueryParams();
      const url = `${this.cardUrl}?${this.commonService.buildQueryParams(this.commonService.queryParams)}`;
      return this.http.get<ShrinkVisibility>(url, this.options);
    } else {
      return this.http.get<ShrinkVisibility>('assets/data/shrinkVisibilityData.json');
    }
  }

  getShrinkEventsByDay(): Observable<ShrinkEventsData[]> {
    if (environment.useDataKey) {
      const url = `${this.getShrinkEventsByDayUrl}?${this.commonService.buildQueryParams(this.commonService.queryParams)}`;
      return this.http.get<ShrinkEventsData[]>(url, this.options);
    } else {
      return this.http.get<ShrinkEventsData[]>('assets/data/daysOfWeekData.json');
    }
  }

  getShrinkEventBySitesData(): Observable<ShrinkBySites[]> {
    if (environment.useDataKey) {
      const url = `${this.shrinkEventsBySitesUrl}?${this.commonService.buildQueryParams(this.commonService.queryParams)}`;
      return this.http.get<ShrinkBySites[]>(url, this.options);
    } else {
      return this.http.get<ShrinkBySites[]>('assets/data/shrinkEventsBySitesData.json');
    }
  }

  getHoursOfWeekData(): Observable<ShrinkEventsData[]> {
    if (environment.useDataKey) {
      const url = `${this.getHoursOfTheDay}?${this.commonService.buildQueryParams(this.commonService.queryParams)}`;
      return this.http.get<ShrinkEventsData[]>(url, this.options);
    } else {
      return this.http.get<ShrinkEventsData[]>('assets/data/hoursOfDayData.json');
    }
  }

  getProductAttributes(): Observable<string[]> {
    if (environment.useDataKey) {
      const queryParams = {
        tenantId: this.cookieService.get("resTenantId"),
        "key": environment.api.routes.apis.dataKey
      }
      const url = `${this.productAttributeUrl}?${this.commonService.buildQueryParams(queryParams)}`;
      return this.http.get<string[]>(url, this.options);
    } else {
      return this.http.get<string[]>('assets/data/productAttributesData.json');
    }
  }

  getShrinkEventsByProductAttributeData(attribute: string): Observable<ShrinkEventsByProductAttributes[]> {
    if (environment.useDataKey) {
      const url = `${this.shrinkEventsByProductAttributeUrl}?${this.commonService.buildQueryParams({
        ...this.commonService.queryParams,
        attribute
      })}`;
      return this.commonService.parseCsvData(url);
    } else {
      return this.commonService.parseCsvData('assets/data/shrinkEventsByProductAttribute.csv');
    }
  }
 
}
