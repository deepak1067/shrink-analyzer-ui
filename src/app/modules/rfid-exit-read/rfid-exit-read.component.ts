import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-rfit-exit-read',
  templateUrl: './rfid-exit-read.component.html',
  styleUrls: ['./rfid-exit-read.component.scss']
})
export class RFIDExitReadComponent {

  constructor(private commonService:CommonService){}

  ngOnInit(): void {
    this.commonService.sendPageTitle('RFID Exit Read')
  }

}
