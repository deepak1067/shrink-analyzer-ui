import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RFIDExitReadComponent } from './rfid-exit-read.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonService } from 'src/app/shared/services/common.service';
import { DatePipe } from '@angular/common';
import { CookieModule, CookieService } from 'ngx-cookie';
import { AuthService } from 'src/app/core/services/auth.service';

describe('RFITExitReadComponent', () => {
  let component: RFIDExitReadComponent;
  let commonService:CommonService
  let fixture: ComponentFixture<RFIDExitReadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RFIDExitReadComponent],
      imports:[HttpClientTestingModule, CookieModule.forRoot()],
      providers: [AuthService, CookieService, DatePipe, CommonService],
    });
    fixture = TestBed.createComponent(RFIDExitReadComponent);
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
    expect(commonService.sendPageTitle).toHaveBeenCalledWith('RFID Exit Read')
  })
});
