import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPerformanceComponent } from './management-performance.component';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';

describe('ManagementPerformanceComponent', () => {
  let component: ManagementPerformanceComponent;
  let commonService:CommonService
  let fixture: ComponentFixture<ManagementPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPerformanceComponent],
      imports:[HttpClientTestingModule, CookieModule.forRoot()],
      providers: [AuthService, CookieService, DatePipe, CommonService],
    });
    fixture = TestBed.createComponent(ManagementPerformanceComponent);
    commonService = TestBed.inject(CommonService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send page Title', ()=>{
    spyOn(commonService ,'sendPageTitle')
    component.ngOnInit()
    expect(commonService.sendPageTitle).toHaveBeenCalledWith('MANAGEMENT PERFORMANCE')
  })
});
