import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {EpcReadListComponent} from './epc-read-list.component';
import {ShrinkVisibilityService} from '../../core/services/shrink-visibility/shrink-visibility.service';
import {SiteApiResponseService} from '../../core/services/site-api-response.service';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {EPCReadList} from "./epc-read-list.model";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule, CookieService} from "ngx-cookie";
import {AuthService} from "../../core/services/auth.service";
import {DatePipe} from "@angular/common";
import { CommonService } from 'src/app/shared/services/common.service';

describe('EpcReadListComponent', () => {
  let component: EpcReadListComponent;
  let fixture: ComponentFixture<EpcReadListComponent>;
  let shrinkVisibilityService: jasmine.SpyObj<ShrinkVisibilityService>;
  let siteApiResponseService: jasmine.SpyObj<SiteApiResponseService>;
  let commonService: jasmine.SpyObj<CommonService>;

  const mockProductAttributes = ['Attribute1', 'Attribute2'];
  const mockEPCReadList: EPCReadList[] = [
    {
      "Event Time": "Time1",
      "Exit Event ID": "",
      "POS Transaction ID": "",
      "EPC": "EPC1",
      "Site Code": "SiteCode1",
      "Read Point": "Point1",
      "Last Read Time": "",
      "Product Code": "",
      "product-attributes": []
    },
    {
      "Event Time": "Time2",
      "Exit Event ID": "",
      "POS Transaction ID": "",
      "EPC": "EPC2",
      "Site Code": "SiteCode2",
      "Read Point": "Point2",
      "Last Read Time": "",
      "Product Code": "",
      "product-attributes": []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpcReadListComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      providers: [
        AuthService,
        CookieService,
        DatePipe,
        ShrinkVisibilityService,
        SiteApiResponseService,
        CommonService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    shrinkVisibilityService = TestBed.inject(ShrinkVisibilityService) as jasmine.SpyObj<ShrinkVisibilityService>;
    siteApiResponseService = TestBed.inject(SiteApiResponseService) as jasmine.SpyObj<SiteApiResponseService>;
    commonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;

    fixture = TestBed.createComponent(EpcReadListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update dynamic columns', () => {
    component.productAttributeList = mockProductAttributes;
    component.updateDynamicColumns();
    expect(component.epcColumnDef.length).toBe(6 + mockProductAttributes.length);
  });

  it('should call getDynamicAttributeColumns and getEpcData on ngOnInit', () => {
    spyOn(component, 'getDynamicAttributeColumns');
    spyOn(component, 'getEpcData');
    component.ngOnInit();
    expect(component.getDynamicAttributeColumns).toHaveBeenCalled();
    expect(component.getEpcData).toHaveBeenCalled();
  });

  it('should update dynamic columns', () => {
    spyOn(shrinkVisibilityService, 'getProductAttributes').and.returnValue(of(mockProductAttributes));
    component.getDynamicAttributeColumns();
    expect(component.productAttributeList).toEqual(mockProductAttributes);
    expect(component.epcColumnDef.length).toBe(6 + mockProductAttributes.length);
  });

  it('should fetch EpcReadList and update isLoading', () => {
    spyOn(shrinkVisibilityService, 'getProductAttributes').and.returnValue(of(mockProductAttributes));
    spyOn(siteApiResponseService, 'getSiteNameBySiteCode').and.callThrough();
    spyOn(component['epcReadListService'], 'getEPCReadList').and.returnValue(of(mockEPCReadList));

    component.ngOnInit();

    expect(siteApiResponseService.getSiteNameBySiteCode).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.epcReadList.length).toBe(mockEPCReadList.length);
  });

  it('should call downloadFile() with correct arguments when downloadCSVFile() is called', () => {
    spyOn(component, 'generateFormattedData').and.callThrough();
    spyOn(commonService, 'downloadFile');
    const mockDynamicColumns = ['Attribute1', 'Attribute2'];
    component.productAttributeList = mockProductAttributes;
    component.epcReadList = mockEPCReadList;
    component.downloadCSVFile();
    expect(component.generateFormattedData).toHaveBeenCalledTimes(mockEPCReadList.length);
    const expectedFilteredData = mockEPCReadList.map((item) => {
      return component.generateFormattedData(item, mockDynamicColumns);
    });

    expect(commonService.downloadFile).toHaveBeenCalledWith(
      expectedFilteredData,'Epc_read_list',component.commonService.startDate,component.commonService.endDate
    );
   });

   it('should send page Title', ()=>{
    spyOn(commonService ,'sendPageTitle')
    component.ngOnInit()
    expect(commonService.sendPageTitle).toHaveBeenCalledWith('EPC Read List')
  })

});
 