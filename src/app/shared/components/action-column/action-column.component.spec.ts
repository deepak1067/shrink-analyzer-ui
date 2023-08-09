import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionColumnComponent } from './action-column.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../module/material.module';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from '../../services/common.service';

describe('ActionColumnComponent', () => {
  let component: ActionColumnComponent;
  let fixture: ComponentFixture<ActionColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionColumnComponent],   
      imports:[HttpClientTestingModule,
        CookieModule.forRoot(),MaterialModule],
     providers: [AuthService, CookieService, DatePipe, CommonService],
     schemas: [NO_ERRORS_SCHEMA]    
    });
    fixture = TestBed.createComponent(ActionColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update status and call service on onUpdateAction', () => {
    const eventId = 'EventId 1';
    const event = { value: 'Employee' };

    component.bulkEventCellValue = { data: { Status: 'Others' } };
    component.onUpdateAction(event, eventId);
    expect(component.bulkEventCellValue.data.Status).toBe(event.value);
  });

});
