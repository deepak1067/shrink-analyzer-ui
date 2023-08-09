import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CommonService} from '../../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class EpcReadListService {
  private epcReadListUrl = `${environment.api.baseUrl}${environment.api.routes.apis.getEpcEvents}`;

  constructor(
    private commonService: CommonService
  ) {
  }

  getEPCReadList(): Observable<any> {
    if (environment.useDataKey) {
      const url = `${this.epcReadListUrl}?${this.commonService.buildQueryParams(this.commonService.queryParams)}`;
      return this.commonService.parseCsvData(url);
    } else {
      const data1 = 'assets/data/epcData.csv';
      const data2 = 'assets/data/epc_test.csv'
      const data = (environment.env == 'LOCAL' || environment.env == 'DEV') ? data1 : data2
      console.log(data);
      return this.commonService.parseCsvData(data);
    }
  }
}
