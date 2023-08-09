import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShrinkEventsByProductAttributes } from "../../../modules/shrink-visibility/shrink-visibility.model";
import { RollUpBarChartComponent } from './roll-up-bar-chart.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule, CookieService} from "ngx-cookie";
import {DatePipe} from "@angular/common";

describe('RollUpBarChartComponent', () => {
  const mockBarChartData: ShrinkEventsByProductAttributes[] = [
    { Value: 'Value1', Quantity: 10, Currency: 'USD', Amount: 100, Ratio: 0.89 },
    { Value: 'Value2', Quantity: 20, Currency: 'EUR', Amount: 200, Ratio: 0.20 },
  ];

  @Component({ selector: 'app-chart-child', template: '' })
  class MockChartChildComponent {
    @Input() barChartData: ShrinkEventsByProductAttributes[] = [];
    @Input() selected: string = '';
    @Output() sendChartId = new EventEmitter<string>();
  }

  let component: RollUpBarChartComponent;
  let fixture: ComponentFixture<RollUpBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      providers: [
        CookieService,
        DatePipe
      ],
      declarations: [RollUpBarChartComponent, MockChartChildComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollUpBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createChartColumn when barChartData is not empty', () => {
    spyOn(component, 'createChartColumn');
    component.barChartData = mockBarChartData;
    component.ngOnChanges();
    expect(component.createChartColumn).toHaveBeenCalled();
  });

  it('should not call createChartColumn when barChartData is empty', () => {
    spyOn(component, 'createChartColumn');
    component.ngOnChanges();
    expect(component.createChartColumn).not.toHaveBeenCalled();
  });

  it('should emit chart ID on createChartColumn', () => {
    component.selected = 'SelectedValue';
    component.barChartData = mockBarChartData;
    spyOn(component.sendChartId, 'emit');
    component.createChartColumn();
    expect(component.sendChartId.emit).toHaveBeenCalledWith('rollUpBarChart');
  });
});
