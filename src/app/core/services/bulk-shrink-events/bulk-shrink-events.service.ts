import {Injectable} from "@angular/core";
import {CommonService} from "../../../shared/services/common.service";
import {environment} from "src/environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BulkShrinkEventsService {
  constructor(
    private commonService: CommonService,
    private httpClient: HttpClient
  ) {
  }

  private bulkEventsDataUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getBulkEventsData}`;
  private postExitEventLabelUrl = `${environment.api.baseUrl}${environment.api.routes.apis.setExitEventLabel}`;

  getBulkEvents(): Observable<any> {
    if (environment.useDataKey) {
      const url = `${this.bulkEventsDataUrl}?${this.commonService.buildQueryParams(this.commonService.queryParams)}`;
      return this.commonService.parseCsvData(url);
    } else {
      const data1 = 'assets/data/bulkData.csv';
      const data2 = 'assets/data/bulk_test.csv'
      const data = (environment.env == 'LOCAL' || environment.env == 'DEV') ? data1 : data2
      console.log(data);
      return this.commonService.parseCsvData(data);
    }
  }

  setExitEventLabel(eventId: string, eventLabel: string): Observable<any> {
    const payload = {
      "event-label": eventLabel,
    };
    return this.httpClient.post(
      this.postExitEventLabelUrl + "/" + eventId + "/" + eventLabel,
      payload
    );
  }
}
