import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FilterComponent} from './filter.component';
import {MaterialModule} from 'src/app/shared/module/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SiteApiResponseService} from "../../../core/services/site-api-response.service";
import {Site} from "../../../shared/interface/Site";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatChipInput, MatChipInputEvent} from "@angular/material/chips";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule} from "ngx-cookie";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";

describe('FilterComponent', () => {
    let component: FilterComponent;
    let fixture: ComponentFixture<FilterComponent>;
    let siteApiResponseService: SiteApiResponseService;
    let matChipInputEventStub: Partial<MatChipInputEvent> = {};

    const site1: Site = {
        code: "SiteCode1",
        name: "Site Name 1",
        timezone: "Asia/Jakarta",
        "geo-location": {
            hierarchy: "Asia/Jakarta/Sapat",
            coordinates: {
                latitude: -0.3372032,
                longitude: 103.3702811,
            },
        },
        labels: ["Label 1", "Label 2", "Label 3", "Label 4"],
        "exit-doors": [
            {id: 1, name: "Exit Door 1"},
            {id: 2, name: "Exit Door 2"},
            {id: 3, name: "Exit Door 3"},
        ],
    };

    const site2: Site = {
        code: "SiteCode2",
        name: "Site Name 2",
        timezone: "Asia/Yekaterinburg",
        "geo-location": {
            hierarchy: "Asia/Yekaterinburg/Pokrovskoye",
            coordinates: {
                latitude: 57.3579277,
                longitude: 61.6905815,
            },
        },
        labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5", "Label 6", "Label 7"],
        "exit-doors": [
            {id: 1, name: "Exit Door 1"},
        ],
    };

    const site3: Site = {
        code: "SiteCode3",
        name: "Site Name 3",
        timezone: "Asia/Chongqing",
        "geo-location": {
            hierarchy: "Asia/Chongqing/Bayan",
            coordinates: {
                latitude: 46.085536,
                longitude: 127.403337,
            },
        },
        labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5", "Label 6", "Label 7"],
        "exit-doors": [
            {id: 1, name: "Exit Door 1"},
            {id: 2, name: "Exit Door 2"},
            {id: 3, name: "Exit Door 3"},
            {id: 4, name: "Exit Door 4"},
            {id: 5, name: "Exit Door 5"},
        ],
    };

    const siteApiResponseServiceStub: Partial<SiteApiResponseService> = {

        labelMap: new Map<string, Site[]>([
            ['SiteCode1', [site1]],
            ['SiteCode2', [site2]],
            ['SiteCode3', [site3]],
        ]),
        hierarchyMap: new Map<string, Site>([
            ['Asia/Jakarta/Sapat', site1],
            ['Asia/Yekaterinburg/Pokrovskoye', site2],
            ['Asia/Chongqing/Bayan', site3],
        ]),
        nameMap: new Map<string, Site>([
            ['Site Name 1', site1],
            ['Site Name 2', site2],
            ['Site Name 3', site3],
        ]),
        siteCodeMap: new Map<string, Site>([
            ['SiteCode1', site1],
            ['SiteCode2', site2],
            ['SiteCode3', site3],
        ]),
    };

    const data = {
        title: 'title',
        message: 'message',
        summary: 'my summary'
    };

    function resetComponentState() {
        component.removeSiteCode('siteCode');
        component.removeSiteHierarchy('hierarchy');
        component.removeSiteLabel('siteLabel');
        component.removeSiteName('siteName');
    }

    beforeEach(async () => {
        const matDialogSpy = jasmine.createSpyObj('MatDialogRef', ['onNoClick', 'closeDialog']);
        let MatDialogRefMock;
        await TestBed.configureTestingModule({
            declarations: [FilterComponent],
            imports: [MaterialModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule,
                BrowserAnimationsModule, CookieModule.forRoot(), MatDialogModule],
            providers: [DatePipe,
                { provide: SiteApiResponseService, useValue: siteApiResponseServiceStub },
                { provide: MatDialogRef, useValue: matDialogSpy },
                { provide: MAT_DIALOG_DATA, useValue: data }
            ],
            teardown: {destroyAfterEach: false}
        }).compileComponents();

        fixture = TestBed.createComponent(FilterComponent);
        component = fixture.componentInstance;
        siteApiResponseService = TestBed.inject(SiteApiResponseService);
        // component.siteHierarchy = Array.from(siteApiResponseServiceStub.hierarchyMap!.keys());
        // component.siteCodes = Array.from(siteApiResponseServiceStub.siteCodeMap!.keys());
        // component.siteLabels = Array.from(siteApiResponseServiceStub.labelMap!.keys());
        // component.siteNames = Array.from(siteApiResponseServiceStub.nameMap!.keys());
        //
        // component.siteHierarchySelected = [];
        // component.siteCodesSelected = [];
        // component.siteNamesSelected = [];
        // component.siteLabelsSelected = [];
        await TestBed.compileComponents();
        await fixture.whenStable();
        fixture.detectChanges();
        resetComponentState();
    });

    afterEach(async () => {
        fixture.detectChanges();
        component.ngOnDestroy();
    });

    // describe('Filter Data Handling', () => {
    //     it('should add selected site code to siteCodesSelected array and update other fields', () => {
    //         const siteCode = 'SiteCode1';
    //         const selectedEvent: MatAutocompleteSelectedEvent = {
    //             option: {
    //                 viewValue: siteCode,
    //             },
    //         } as MatAutocompleteSelectedEvent;
    //
    //         component.selectedSiteCode(selectedEvent);
    //         expect(component.siteCodesSelected).toContain(siteCode);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat']);
    //         expect(component.siteNames).toEqual(['Site Name 1']);
    //
    //         component.filterForm.controls['hierarchy'].reset();
    //         expect(component.filterForm.controls['hierarchy'].value).toBeNull();
    //     });
    //
    //     it('should update site name and labels when site code changes', () => {
    //         const siteCode1 = 'SiteCode1';
    //         const siteCode2 = 'SiteCode2';
    //
    //         const selectedEvent1: MatAutocompleteSelectedEvent = {
    //             option: {
    //                 viewValue: siteCode1,
    //             },
    //         } as MatAutocompleteSelectedEvent;
    //
    //         component.selectedSiteCode(selectedEvent1);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4']);
    //         expect(component.siteNames).toEqual(['Site Name 1']);
    //
    //         const selectedEvent2: MatAutocompleteSelectedEvent = {
    //             option: {
    //                 viewValue: siteCode2,
    //             },
    //         } as MatAutocompleteSelectedEvent;
    //         component.selectedSiteCode(selectedEvent2);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteNames).toEqual(['Site Name 1', 'Site Name 2']);
    //     });
    //
    //     it('should add selected site name to siteNamesSelected array and update other fields', () => {
    //         const siteName = 'Site Name 2';
    //         const selectedEvent: MatAutocompleteSelectedEvent = {
    //             option: {
    //                 viewValue: siteName,
    //             },
    //         } as MatAutocompleteSelectedEvent;
    //
    //         component.selectedSiteName(selectedEvent);
    //         expect(component.siteNamesSelected).toContain(siteName);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye']);
    //         expect(component.siteCodes).toEqual(['SiteCode2']);
    //     });
    //
    //     it('should update site hierarchy, names, and labels when site codes are added or removed', () => {
    //         component.selectedSiteCode({option: {viewValue: 'SiteCode1'}} as MatAutocompleteSelectedEvent);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat']);
    //         expect(component.siteNames).toEqual(['Site Name 1']);
    //
    //         component.selectedSiteCode({option: {viewValue: 'SiteCode2'}} as MatAutocompleteSelectedEvent);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye']);
    //         expect(component.siteNames).toEqual(['Site Name 1', 'Site Name 2']);
    //
    //         component.removeSiteCode('SiteCode1');
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye']);
    //         expect(component.siteNames).toEqual(['Site Name 2']);
    //     });
    //
    //     it('should update site hierarchy and names when site code changes', () => {
    //         const siteCode1 = 'SiteCode1';
    //         const siteCode3 = 'SiteCode3';
    //
    //         component.selectedSiteCode({option: {viewValue: siteCode1}} as MatAutocompleteSelectedEvent);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat']);
    //         expect(component.siteNames).toEqual(['Site Name 1']);
    //
    //         component.selectedSiteCode({option: {viewValue: siteCode3}} as MatAutocompleteSelectedEvent);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Chongqing/Bayan']);
    //         expect(component.siteNames).toEqual(['Site Name 1', 'Site Name 3']);
    //     });
    //
    //     it('should remove site code from siteCodesSelected array and update other fields', () => {
    //         const siteCode1 = 'SiteCode1';
    //         const siteCode2 = 'SiteCode2';
    //
    //         component.selectedSiteCode({option: {viewValue: siteCode1}} as MatAutocompleteSelectedEvent);
    //         component.selectedSiteCode({option: {viewValue: siteCode2}} as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodesSelected).toContain(siteCode1);
    //         expect(component.siteCodesSelected).toContain(siteCode2);
    //
    //         component.removeSiteCode('SiteCode1');
    //         expect(component.siteCodesSelected).not.toContain(siteCode1);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye']);
    //         expect(component.siteNames).toEqual(['Site Name 2']);
    //     });
    //
    //     it('should update site hierarchy and codes when site names are added or removed', () => {
    //         const siteName1 = 'Site Name 1';
    //         const siteName2 = 'Site Name 2';
    //         const siteName3 = 'Site Name 3';
    //
    //         component.selectedSiteName({ option: { viewValue: siteName1 } } as MatAutocompleteSelectedEvent);
    //         component.selectedSiteName({ option: { viewValue: siteName2 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye']);
    //         expect(component.siteCodes).toEqual(['SiteCode1', 'SiteCode2']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName3 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteHierarchy).toEqual([
    //             'Asia/Jakarta/Sapat',
    //             'Asia/Yekaterinburg/Pokrovskoye',
    //             'Asia/Chongqing/Bayan'
    //         ]);
    //         expect(component.siteCodes).toEqual(['SiteCode1', 'SiteCode2', 'SiteCode3']);
    //
    //         component.removeSiteName('Site Name 1');
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan']);
    //         expect(component.siteCodes).toEqual(['SiteCode2', 'SiteCode3']);
    //     });
    //
    //     it('should update site labels and hierarchy when site names are added or removed', () => {
    //         const siteName1 = 'Site Name 1';
    //         const siteName2 = 'Site Name 2';
    //         const siteName3 = 'Site Name 3';
    //
    //         component.selectedSiteName({ option: { viewValue: siteName1 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName2 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName3 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteLabels).toEqual([
    //             'Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7'
    //         ]);
    //         expect(component.siteHierarchy).toEqual([
    //             'Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan'
    //         ]);
    //
    //         component.removeSiteName('Site Name 1');
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan']);
    //     });
    //
    //     it('should update site codes, labels, and hierarchy when site names are added or removed', () => {
    //         const siteName1 = 'Site Name 1';
    //         const siteName2 = 'Site Name 2';
    //         const siteName3 = 'Site Name 3';
    //
    //         component.selectedSiteName({ option: { viewValue: siteName1 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode1']);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName2 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode1', 'SiteCode2']);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName3 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode1', 'SiteCode2', 'SiteCode3']);
    //         expect(component.siteLabels).toEqual([
    //             'Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7'
    //         ]);
    //         expect(component.siteHierarchy).toEqual([
    //             'Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan'
    //         ]);
    //
    //         component.removeSiteName('Site Name 1');
    //         expect(component.siteCodes).toEqual(['SiteCode2', 'SiteCode3']);
    //         expect(component.siteLabels).toEqual([
    //             'Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7'
    //         ]);
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan']);
    //     });
    //
    //     it('should select and unselect site code and other fields', () => {
    //         const siteName1 = 'Site Name 1';
    //         const siteName2 = 'Site Name 2';
    //         const siteName3 = 'Site Name 3';
    //
    //         component.selectedSiteName({ option: { viewValue: siteName1 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode1']);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName2 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode1', 'SiteCode2']);
    //         expect(component.siteLabels).toEqual(['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7']);
    //         expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye']);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName3 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode1', 'SiteCode2', 'SiteCode3']);
    //         expect(component.siteLabels).toEqual([
    //             'Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7'
    //         ]);
    //         expect(component.siteHierarchy).toEqual([
    //             'Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan'
    //         ]);
    //
    //         component.selectedSiteName({ option: { viewValue: siteName1 } } as MatAutocompleteSelectedEvent);
    //         expect(component.siteCodes).toEqual(['SiteCode2', 'SiteCode3']);
    //         expect(component.siteLabels).toEqual([
    //             'Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7'
    //         ]);
    //         expect(component.siteHierarchy).toEqual(['Asia/Yekaterinburg/Pokrovskoye', 'Asia/Chongqing/Bayan']);
    //     });
    //
    // });


    it('should initialize component properties in ngOnInit', () => {
        component.hours = [];
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.hours.length).not.toBeGreaterThan(0);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should fill the hours array with hour numbers', () => {
        component.ngOnInit();
        expect(component.hours.length).not.toBe(0);
    });

    it('should set the filter applied to true', () => {
        component.onFormSubmit(true);
        expect(component.filterApplied).toBe(true);
    });

    it('should clear the form on clicking the clearFilter button', () => {
        component.clearFilter();
        expect(component.isChecked).toBe(false);
        expect(component.filterForm.value).toEqual({
            startDate: null, endDate: null, startTime: null, endTime: null, hierarchy: null,
            siteCode: null, siteName: null, siteLabel: null, itemLabel: null, excludeInCatalog: null
        });
    });

    it('should remove chip when remove() is called', () => {
        const hierarchy = 'TestHierarchy';
        component.siteHierarchySelected = [hierarchy];
        component.removeSiteHierarchy('TestHierarchy');
        expect(component.siteHierarchySelected.length).toBe(0);
    });

    it('should open autocomplete trigger', () => {
        const trigger: MatAutocompleteTrigger = jasmine.createSpyObj('MatAutocompleteTrigger', ['openPanel']);
        spyOn(component, 'openAuto').and.callThrough();
        component.openAuto(trigger, 'siteCode');
        expect(component.openAuto).toHaveBeenCalled();
        expect(trigger.openPanel).toHaveBeenCalled();
    });


    describe('_filter method', () => {
        beforeEach(() => {
            component.siteCodes = ['siteCode1', 'siteCode2', 'siteCode3'];
            component.siteLabels = ['label1', 'label2', 'label3'];
            component.siteNames = ['siteName1', 'siteName2', 'siteName3'];
            component.siteHierarchy = ['hierarchy1', 'hierarchy2', 'hierarchy3'];
        });


        it('should filter site codes correctly', () => {
            const value = 'Code';
            const formName = 'siteCode';
            const result = component['_filter'](value, formName);
            expect(result).toEqual(['siteCode1', 'siteCode2', 'siteCode3']);
        });


        it('should filter site labels correctly', () => {
            const value = 'Label';
            const formName = 'siteLabel';
            const result = component['_filter'](value, formName);
            expect(result).toEqual(['label1', 'label2', 'label3']);
        });


        it('should filter site names correctly', () => {
            const value = 'Name';
            const formName = 'siteName';
            const result = component['_filter'](value, formName);
            expect(result).toEqual(['siteName1', 'siteName2', 'siteName3']);
        });


        it('should filter site hierarchy correctly', () => {
            const value = 'Hierarchy';
            const formName = 'siteHierarchy';
            const result = component['_filter'](value, formName);
            expect(result).toEqual(['hierarchy1', 'hierarchy2', 'hierarchy3']);
        });


        it('should return an empty array for unknown formName', () => {
            const value = 'Test';
            const formName = 'unknown';
            const result = component['_filter'](value, formName);
            expect(result).toEqual([]);
        });
    });


    describe('remove method', () => {
        beforeEach(() => {
            component.siteCodesSelected = ['siteCode1', 'siteCode2', 'siteCode3'];
            component.siteNamesSelected = ['siteName1', 'siteName2', 'siteName3'];
            component.siteLabelsSelected = ['label1', 'label2', 'label3'];
            component.siteHierarchySelected = ['hierarchy1', 'hierarchy2', 'hierarchy3'];
        });


        it('should reset the filterForm controls when all selected arrays are empty', () => {
            component.siteCodesSelected = [];
            component.siteNamesSelected = [];
            component.siteLabelsSelected = [];
            component.siteHierarchySelected = [];
            component.removeSiteCode('siteCode1');
            component.removeSiteHierarchy('hierarchy1');
            component.removeSiteLabel('label1');
            component.removeSiteName('siteName1');
            expect(component.filterForm.get('siteCode')?.value).toBeNull();
            expect(component.filterForm.get('siteName')?.value).toBeNull();
            expect(component.filterForm.get('siteLabel')?.value).toBeNull();
            expect(component.filterForm.get('hierarchy')?.value).toBeNull();
        });


        it('should remove selected site name from siteNamesSelected and update site details', () => {
            const siteName = 'Site Name 1';
            const formName = 'siteName';
            component.siteNamesSelected = [siteName, 'Site Name 2'];
            spyOn(component, 'updateSiteCodes');
            spyOn(component, 'updateSiteLabels');
            spyOn(component, 'updateSiteHierarchy');
            component.removeSiteName('Site Name 1');
            expect(component.siteNamesSelected).not.toContain(siteName);
            expect(component.updateSiteCodes).toHaveBeenCalled();
            expect(component.updateSiteLabels).toHaveBeenCalled();
            expect(component.updateSiteHierarchy).toHaveBeenCalled();
            expect(component.siteNameInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toEqual(null);
        });


        it('should remove selected site label from siteLabelsSelected and update site details', () => {
            const siteLabel = 'Label1';
            const formName = 'siteLabel';
            component.siteLabelsSelected = [siteLabel, 'Label2'];
            spyOn(component, 'updateSiteCodesFromSiteArrayMap');
            spyOn(component, 'updateSiteHierarchyFromSiteArrayMap');
            spyOn(component, 'updateSiteNamesFromSiteArrayMap');
            component.removeSiteLabel('Label1');
            expect(component.siteLabelsSelected).not.toContain(siteLabel);
            expect(component.updateSiteCodesFromSiteArrayMap).toHaveBeenCalled();
            expect(component.updateSiteHierarchyFromSiteArrayMap).toHaveBeenCalled();
            expect(component.updateSiteNamesFromSiteArrayMap).toHaveBeenCalled();
            expect(component.siteLabelInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toEqual(null);
        });


        it('should remove selected site code from siteCodesSelected and update site details', () => {
            const siteCode = 'SiteCode1';
            const formName = 'siteCode';
            component.siteCodesSelected = [siteCode, 'SiteCode2'];
            spyOn(component, 'updateSiteLabels');
            spyOn(component, 'updateSiteHierarchy');
            spyOn(component, 'updateSiteNames');
            component.removeSiteCode(siteCode);
            expect(component.siteCodesSelected).not.toContain(siteCode);
            expect(component.updateSiteLabels).toHaveBeenCalled();
            expect(component.updateSiteHierarchy).toHaveBeenCalled();
            expect(component.updateSiteNames).toHaveBeenCalled();
            expect(component.siteCodeInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toEqual(null);
        });


        it('should remove selected site hierarchy from siteHierarchySelected and update site details', () => {
            const siteHierarchy = 'Hierarchy1';
            const formName = 'siteHierarchy';
            component.siteHierarchySelected = [siteHierarchy, 'Hierarchy2'];
            spyOn(component, 'updateSiteCodes');
            spyOn(component, 'updateSiteLabels');
            spyOn(component, 'updateSiteNames');
            component.removeSiteHierarchy(siteHierarchy);
            expect(component.siteHierarchySelected).not.toContain(siteHierarchy);
            expect(component.updateSiteCodes).toHaveBeenCalled();
            expect(component.updateSiteLabels).toHaveBeenCalled();
            expect(component.updateSiteNames).toHaveBeenCalled();
            expect(component.hierarchyInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName]?.value ?? null).toBeNull();
        });
    });


    describe('selected method', () => {
        const eventMock: MatAutocompleteSelectedEvent = {
            option: {viewValue: 'Option 1'},
        } as MatAutocompleteSelectedEvent;


        it('should add selected value to siteCodesSelected and update site details', () => {
            const formName = 'siteCode';
            component.siteCodesSelected = [];
            spyOn(component, 'updateSiteLabels');
            spyOn(component, 'updateSiteHierarchy');
            spyOn(component, 'updateSiteNames');
            component.selectedSiteCode(eventMock);
            expect(component.siteCodesSelected).toContain('Option 1');
            expect(component.updateSiteLabels).toHaveBeenCalled();
            expect(component.updateSiteHierarchy).toHaveBeenCalled();
            expect(component.updateSiteNames).toHaveBeenCalled();
            expect(component.siteCodeInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toBeNull();
        });


        it('should add selected value to siteLabelsSelected and update site details', () => {
            const formName = 'siteLabel';
            component.siteLabelsSelected = [];
            spyOn(component, 'updateSiteCodesFromSiteArrayMap');
            spyOn(component, 'updateSiteHierarchyFromSiteArrayMap');
            spyOn(component, 'updateSiteNamesFromSiteArrayMap');
            component.selectedSiteLabel(eventMock);
            expect(component.siteLabelsSelected).toContain('Option 1');
            expect(component.updateSiteCodesFromSiteArrayMap).toHaveBeenCalled();
            expect(component.updateSiteHierarchyFromSiteArrayMap).toHaveBeenCalled();
            expect(component.updateSiteNamesFromSiteArrayMap).toHaveBeenCalled();
            expect(component.siteLabelInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toBeNull();
        });


        it('should add selected value to siteNamesSelected and update site details', () => {
            const formName = 'siteName';
            component.siteNamesSelected = [];
            spyOn(component, 'updateSiteCodes');
            spyOn(component, 'updateSiteLabels');
            spyOn(component, 'updateSiteHierarchy');
            component.selectedSiteName(eventMock);
            expect(component.siteNamesSelected).toContain('Option 1');
            expect(component.updateSiteCodes).toHaveBeenCalled();
            expect(component.updateSiteLabels).toHaveBeenCalled();
            expect(component.updateSiteHierarchy).toHaveBeenCalled();
            expect(component.siteNameInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toBeNull();
        });


        it('should add selected value to siteHierarchySelected and update site details', () => {
            const formName = 'hierarchy';
            component.siteHierarchySelected = [];
            spyOn(component, 'updateSiteCodes');
            spyOn(component, 'updateSiteLabels');
            spyOn(component, 'updateSiteNames');
            component.selectedSiteHierarchy(eventMock);
            expect(component.siteHierarchySelected).toContain('Option 1');
            expect(component.updateSiteCodes).toHaveBeenCalled();
            expect(component.updateSiteLabels).toHaveBeenCalled();
            expect(component.updateSiteNames).toHaveBeenCalled();
            expect(component.hierarchyInput.nativeElement.value).toBe('');
            expect(component.filterForm.controls[formName].value).toBeNull();
        });


        it('should open the respective autocomplete trigger', () => {
            const trigger: MatAutocompleteTrigger = jasmine.createSpyObj('MatAutocompleteTrigger', ['openPanel']);
            const formName = 'siteCode';
            spyOn(component, 'openAuto').and.callThrough();
            component.openAuto(trigger, formName);
            expect(component.openAuto).toHaveBeenCalledWith(trigger, formName);
            expect(trigger.openPanel).toHaveBeenCalled();
        });
    });


    it('should update siteHierarchy correctly', () => {
        siteApiResponseService.hierarchyMap.set('Site1', site1);
        siteApiResponseService.hierarchyMap.set('Site2', site2);
        component.siteCodesSelected = ['Site1', 'Site2'];
        component.updateSiteHierarchy(component.siteCodesSelected, siteApiResponseService.hierarchyMap);
        expect(component.siteHierarchy).toEqual(['Asia/Jakarta/Sapat', 'Asia/Yekaterinburg/Pokrovskoye']);
    });


    it('should remove selected item correctly in remove method', () => {
        const hierarchy = 'TestHierarchy';
        const formName = 'siteCode';
        component.siteHierarchySelected = [hierarchy, 'OtherHierarchy'];
        component.removeSiteHierarchy(hierarchy);
        expect(component.siteHierarchySelected).toEqual(['OtherHierarchy']);
    });


    describe('openAuto method', () => {
        let trigger: MatAutocompleteTrigger;
        beforeEach(() => {
            trigger = jasmine.createSpyObj('MatAutocompleteTrigger', ['openPanel']);
            spyOn(component.siteCodeInput.nativeElement, 'focus');
            spyOn(component.siteNameInput.nativeElement, 'focus');
            spyOn(component.siteLabelInput.nativeElement, 'focus');
            spyOn(component.hierarchyInput.nativeElement, 'focus');
        });


        it('should open autocomplete trigger for siteCode form', async () => {
            const formName = 'siteCode';
            component.openAuto(trigger, formName);
            await fixture.whenStable();
            expect(trigger.openPanel).toHaveBeenCalled();
            expect(component.siteCodeInput.nativeElement.focus).toHaveBeenCalled();
        });


        it('should open autocomplete trigger for siteName form', async () => {
            const formName = 'siteName';
            component.openAuto(trigger, formName);
            await fixture.whenStable();
            expect(trigger.openPanel).toHaveBeenCalled();
            expect(component.siteNameInput.nativeElement.focus).toHaveBeenCalled();
        });


        it('should open autocomplete trigger for siteLabel form', async () => {
            const formName = 'siteLabel';
            component.openAuto(trigger, formName);
            await fixture.whenStable();
            expect(trigger.openPanel).toHaveBeenCalled();
            expect(component.siteLabelInput.nativeElement.focus).toHaveBeenCalled();
        });


        it('should open autocomplete trigger for hierarchy form', async () => {
            const formName = 'hierarchy';
            component.openAuto(trigger, formName);
            await fixture.whenStable();
            expect(trigger.openPanel).toHaveBeenCalled();
            expect(component.hierarchyInput.nativeElement.focus).toHaveBeenCalled();
        });
    });


    it('should update excludeInCatalog control in filterForm correctly', () => {
        component.filterForm.controls['excludeInCatalog'].setValue(false);
        const event = {checked: true};
        component.onChange(event);
        expect(component.filterForm.controls['excludeInCatalog'].value).toBe(true);
        component.filterForm.controls['excludeInCatalog'].setValue(true);
        const event2 = {checked: false};
        component.onChange(event2);
        expect(component.filterForm.controls['excludeInCatalog'].value).toBe(false);
    });


    function createMockMatChipInput(): MatChipInput {
        return {
            id: 'mock-input',
            focus: jasmine.createSpy('focus'),
        } as unknown as MatChipInput;
    }


    describe('add method', () => {


        it('should add value to siteCodesSelected and reset the form control', () => {
            const formName = 'siteCode';
            const value = 'SiteCode1';
            matChipInputEventStub.chipInput = createMockMatChipInput();
            matChipInputEventStub.value = value;
            component.addSiteDataForSiteCode(matChipInputEventStub);
            expect(component.siteCodesSelected).toContain(value.trim());
        });


        it('should reset the chip input element id', () => {
            const formName = 'siteCode';
            const value = 'SiteCode1';
            matChipInputEventStub.chipInput = createMockMatChipInput();
            matChipInputEventStub.value = value;
            component.addSiteDataForSiteCode(matChipInputEventStub);
            expect(matChipInputEventStub.chipInput?.id).toBe('');
        });


        it('should add value to siteNamesSelected and reset the form control', () => {
            const value = 'Site Name 1';
            matChipInputEventStub.chipInput = createMockMatChipInput();
            matChipInputEventStub.value = value;
            component.addSiteDataForSiteName(matChipInputEventStub);
            expect(component.siteNamesSelected).toContain(value.trim());
        });


        it('should add value to siteLabelsSelected and reset the form control', () => {
            const value = 'Label1';
            matChipInputEventStub.chipInput = createMockMatChipInput();
            matChipInputEventStub.value = value;
            component.addSiteDataForSiteLabel(matChipInputEventStub);
            expect(component.siteLabelsSelected).toContain(value.trim());
        });


        it('should add value to siteHierarchySelected and reset the form control', () => {
            const value = 'Hierarchy1';
            matChipInputEventStub.chipInput = createMockMatChipInput();
            matChipInputEventStub.value = value;
            component.addSiteDataForSiteHierarchy(matChipInputEventStub);
            expect(component.siteHierarchySelected).toContain(value.trim());
        });


        afterEach(() => {
            resetComponentState();
            component.ngOnDestroy();
        });
    });


    it('should add a site to siteHierarchySelected', () => {
        let value = 'Site Hierarchy 1'
        matChipInputEventStub.chipInput = createMockMatChipInput();
        matChipInputEventStub.value = value;
        component.addSiteDataForSiteHierarchy(matChipInputEventStub);
        expect(component.siteHierarchySelected).toContain('Site Hierarchy 1');
    });


    it('should add a site to siteLabelsSelected', () => {
        let value = 'Site Label 1'
        matChipInputEventStub.chipInput = createMockMatChipInput();
        matChipInputEventStub.value = value;
        component.addSiteDataForSiteLabel(matChipInputEventStub);
        expect(component.siteLabelsSelected).toContain('Site Label 1');
    });


    it('should add a site to siteNamesSelected', () => {
        let value = 'Site Name 1'
        matChipInputEventStub.chipInput = createMockMatChipInput();
        matChipInputEventStub.value = value;
        component.addSiteDataForSiteName(matChipInputEventStub);
        expect(component.siteNamesSelected).toContain('Site Name 1');
    });


    it('should add a site to siteCodesSelected', () => {
        let value = 'Site Code 1'
        matChipInputEventStub.chipInput = createMockMatChipInput();
        matChipInputEventStub.value = value;
        component.addSiteDataForSiteCode(matChipInputEventStub);
        expect(component.siteCodesSelected).toContain('Site Code 1');
    });


    it('should remove a site from siteHierarchySelected', () => {
        component.siteHierarchySelected = ['Site Hierarchy 1', 'Site Hierarchy 2'];
        component.removeSiteHierarchy('Site Hierarchy 1');
        expect(component.siteHierarchySelected).not.toContain('Site Hierarchy 1');
    });


    it('should remove a site from siteLabelsSelected', () => {
        component.siteLabelsSelected = ['Site Label 1', 'Site Label 2'];
        component.removeSiteLabel('Site Label 1');
        expect(component.siteLabelsSelected).not.toContain('Site Label 1');
    });


    it('should remove a site from siteNamesSelected', () => {
        component.siteNamesSelected = ['Site Name 1', 'Site Name 2'];
        component.removeSiteName('Site Name 1');
        expect(component.siteNamesSelected).not.toContain('Site Name 1');
    });


    it('should remove a site from siteCodesSelected', () => {
        component.siteCodesSelected = ['Site Code 1', 'Site Code 2'];
        component.removeSiteCode('Site Code 1');
        expect(component.siteCodesSelected).not.toContain('Site Code 1');
    });


    it('should update siteHierarchySelected with selected value', () => {
        component.siteHierarchy = ['Site Hierarchy 1', 'Site Hierarchy 2'];
        component.selectedSiteHierarchy({
            option: { viewValue: 'Site Hierarchy 3' },
        } as MatAutocompleteSelectedEvent);
        expect(component.siteHierarchySelected).toContain('Site Hierarchy 3');
    });


    it('should update siteLabelsSelected with selected value', () => {
        component.siteLabels = ['Site Label 1', 'Site Label 2'];
        component.selectedSiteLabel({
            option: { viewValue: 'Site Label 3' },
        } as MatAutocompleteSelectedEvent);
        expect(component.siteLabelsSelected).toContain('Site Label 3');
    });


    it('should update siteNamesSelected with selected value', () => {
        component.siteNames = ['Site Name 1', 'Site Name 2'];
        component.selectedSiteName({
            option: { viewValue: 'Site Name 3' },
        } as MatAutocompleteSelectedEvent);
        expect(component.siteNamesSelected).toContain('Site Name 3');
    });


    it('should update siteCodesSelected with selected value', () => {
        component.siteCodes = ['Site Code 1', 'Site Code 2'];
        component.selectedSiteCode({
            option: { viewValue: 'Site Code 3' },
        } as MatAutocompleteSelectedEvent);
        expect(component.siteCodesSelected).toContain('Site Code 3');
    });


    it('should add and then remove a site from siteHierarchySelected', () => {
        let value = 'Site Hierarchy 1'
        matChipInputEventStub.chipInput = createMockMatChipInput();
        matChipInputEventStub.value = value;
        component.addSiteDataForSiteHierarchy(matChipInputEventStub);
        expect(component.siteHierarchySelected).toContain('Site Hierarchy 1');
        component.removeSiteHierarchy('Site Hierarchy 1');
        expect(component.siteHierarchySelected).not.toContain('Site Hierarchy 1');
    });


    it('should add and then update siteHierarchySelected with selected value', () => {
        let value1 = 'Site Hierarchy 1'
        matChipInputEventStub.chipInput = createMockMatChipInput();
        matChipInputEventStub.value = value1;
        component.addSiteDataForSiteHierarchy(matChipInputEventStub);
        expect(component.siteHierarchySelected).toContain('Site Hierarchy 1');
        component.siteHierarchy = ['Site Hierarchy 1', 'Site Hierarchy 2'];
        component.selectedSiteHierarchy({ option: { viewValue: 'Site Hierarchy 3' } } as MatAutocompleteSelectedEvent);
        expect(component.siteHierarchySelected).toContain('Site Hierarchy 3');
    });
});
