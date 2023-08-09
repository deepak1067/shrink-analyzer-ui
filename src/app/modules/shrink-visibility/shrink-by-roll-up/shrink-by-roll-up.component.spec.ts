import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ShrinkByRollUpComponent } from "./shrink-by-roll-up.component";
import { ShrinkVisibilityService } from "src/app/core/services/shrink-visibility/shrink-visibility.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CookieModule } from "ngx-cookie";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import {ShrinkEventsByProductAttributes} from "../shrink-visibility.model";
import { CommonService } from "src/app/shared/services/common.service";

describe("ShrinkByRollUpComponent", () => {
  let component: ShrinkByRollUpComponent;
  let fixture: ComponentFixture<ShrinkByRollUpComponent>;
  let shrinkVisibilityService: ShrinkVisibilityService;
  let commonService:CommonService
  let mockProductAttributes: string[] = [
    "Attribute1",
    "Attribute2",
    "Attribute3",
  ];
  let mockShrinkEventsData: ShrinkEventsByProductAttributes[] = [{
    Value: "Value1",
    Quantity: 10,
    Amount: 100,
    Currency: "USD",
    Ratio: 0.25,
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShrinkByRollUpComponent],
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      providers: [ShrinkVisibilityService, DatePipe, CommonService,
        { provide: ActivatedRoute,
          useValue: { queryParams: of({ attribute: "Attribute1" }),
            snapshot: { queryParamMap: { has: (param: string) => param === "attribute" }}},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ShrinkByRollUpComponent);
    component = fixture.componentInstance;
    shrinkVisibilityService = TestBed.inject(ShrinkVisibilityService);
    commonService = TestBed.inject(CommonService)
    spyOn(shrinkVisibilityService, "getProductAttributes").and.returnValue(
      of(mockProductAttributes));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update the shrinkEventsByProductAttributes array when calling getShrinkEventsData", () => {
    const attribute = "Attribute2";
    spyOn(shrinkVisibilityService, "getShrinkEventsByProductAttributeData").and.returnValue(of(mockShrinkEventsData));
    component.getShrinkEventsData(attribute);
    expect(component.shrinkEventsByProductAttributes.every(item => item.hasOwnProperty('formattedData'))).toBeTrue();
  });

  it("should call getProductAttributes function", () => {
    component.getProductAttributes();
    expect(component.productAttributes.length).toEqual(3);
  });

  it("should set the view type according to the button clicked", () => {
    const event = "chart";
    component.onToggleClick(event);
    expect(component.viewType).toEqual("chart");
  });

  it("should call getShrinkEventsData and generateDynamicColumnDef onSelectionChange", () => {
    spyOn(component, "getShrinkEventsData");
    spyOn(component, "generateDynamicColumnDef");
    const attribute = "Attribute2";
    component.filterByProductAttribute(attribute);
    expect(component.getShrinkEventsData).toHaveBeenCalledWith(attribute);
    expect(component.generateDynamicColumnDef).toHaveBeenCalledWith(attribute);
  });

  it("should call downloadFile function with correct parameters when viewType is 'table'", () => {
    component.viewType = "table";
    spyOn(commonService, "downloadFile");
    component.downloadFile("event");
    expect(commonService.downloadFile).toHaveBeenCalled();
  });

  it("should call filterByProductAttribute with correct parameters", () => {
    spyOn(component, "generateDynamicColumnDef");
    spyOn(component, "getShrinkEventsData");
    const attribute = "Attribute2";
    component.filterByProductAttribute(attribute);
    expect(component.generateDynamicColumnDef).toHaveBeenCalledWith(attribute);
    expect(component.getShrinkEventsData).toHaveBeenCalledWith(attribute);
  });

  it("should call filterByProductAttribute with correct attribute in setQueryParamsAndLoadData", () => {
    spyOn(component, "filterByProductAttribute");
    const attribute = "Attribute3";
    component.setQueryParamsAndLoadData(attribute);
    expect(component.filterByProductAttribute).toHaveBeenCalledWith(attribute);
  });

  it("should generate formatted data correctly", () => {
    const formattedData = component.generateFormattedData(mockShrinkEventsData[0]);
    expect(formattedData[component.selectedValue]).toEqual("Value1");
    expect(formattedData["Total Shrink Events"]).toEqual(10);
    expect(formattedData["Total Product Value"]).toEqual("$ 100");
    expect(formattedData["Shrink %"]).toEqual("25.00");
  });

  it("should render currency cell correctly", () => {
    const params: any = {data: { Currency: "USD" }, value: 100,};
    const result = component.currencyCellRenderer(params);
    expect(result).toEqual("$ 100");
  });

  it("should call downloadChartAsPDF method with correct parameters when viewType is 'chart'", () => {
    component.viewType = "chart";
    const chartId = "chart1";
    spyOn(commonService, "downloadChartAsPDF");
    component.getChartId(chartId);
    component.downloadFile("event");
    expect(commonService.downloadChartAsPDF).toHaveBeenCalledWith(chartId, jasmine.any(String), jasmine.any(String), jasmine.any(String));
  });

});
