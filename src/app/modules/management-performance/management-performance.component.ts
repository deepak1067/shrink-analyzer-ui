import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-management-performance',
  templateUrl: './management-performance.component.html',
  styleUrls: ['./management-performance.component.scss']
})
export class ManagementPerformanceComponent {
  constructor(private commonService:CommonService){}

  ngOnInit(): void {
    this.commonService.sendPageTitle('MANAGEMENT PERFORMANCE')
  }
}
