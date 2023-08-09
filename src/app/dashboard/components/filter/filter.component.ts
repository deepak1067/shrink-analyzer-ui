import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SiteApiResponseService } from "../../../core/services/site-api-response.service";
import {Observable, Subscription} from "rxjs";
import { map, startWith } from "rxjs/operators";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {Site} from "../../../shared/interface/Site";
import { FilterChange, FilterFields} from "../../../modules/shrink-visibility/shrink-visibility.model";
import {DatePipe} from "@angular/common";
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    providers: [DatePipe]
})
export class FilterComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    siteLabels: string[] = [];
    siteNames: string[] = [];
    siteHierarchy: string[] = [];
    siteCodes: string[] = [];
    subscription!: Subscription;
    max = 24;
    min = 0;
    step = 1;
    eventLabels: string[] = ['Organized Crime','External Theft','Employee','Omni Sale','Transfer','Others','Not a Loss Event','Mixed'];

    siteHierarchySelected: string[] = [];
    siteCodesSelected :string[] = [];
    siteNamesSelected :string[] = [];
    siteLabelsSelected :string[] = [];


    filteredSiteLabelOptions!: Observable<string[]>;
    filteredSiteNameOptions!: Observable<string[]>;
    filteredHierarchyOptions!:  Observable<string[]>;
    filteredSiteCodeOptions!: Observable<string[]>;

    hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    filterForm: FormGroup = new FormGroup({
        startDate: new FormControl(null, Validators.required),
        endDate: new FormControl(null, Validators.required),
        startTime: new FormControl(0),
        endTime: new FormControl(0),
        hierarchy: new FormControl([]),
        siteCode: new FormControl([]),
        siteName: new FormControl([]),
        siteLabel: new FormControl([]),
        itemLabel: new FormControl([]),
        excludeInCatalog: new FormControl(false)
    });

    isChecked: boolean = false;
    filterApplied: boolean = true;

    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filterAppliedValues: any;

    @ViewChild('hierarchyInput') hierarchyInput!: ElementRef<HTMLInputElement>;
    @ViewChild('siteCodeInput') siteCodeInput!: ElementRef<HTMLInputElement>;
    @ViewChild('siteLabelInput') siteLabelInput!: ElementRef<HTMLInputElement>;
    @ViewChild('siteNameInput') siteNameInput!: ElementRef<HTMLInputElement>;

    @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
    @ViewChild('autocompleteTriggerSite') sideCodeACTrigger!: MatAutocompleteTrigger;
    @ViewChild('autocompleteTriggerLabel') sideLabelACTrigger!: MatAutocompleteTrigger;
    @ViewChild('autocompleteTriggerSiteName') sideNameACTrigger!: MatAutocompleteTrigger;

    constructor(private siteApiResponseService: SiteApiResponseService,
                private commonService: CommonService, 
                public datePipe: DatePipe,
                private dilogRef: MatDialogRef<any>,
                private router:Router,) {}

    ngOnInit(): void {
        this.reset();
        if(localStorage.getItem('isFilterApplied') === 'true'){
            let appliedValues = localStorage.getItem('filterValues');
            this.filterAppliedValues = JSON.parse(appliedValues ?? '');
            this.siteCodesSelected = this.filterAppliedValues['site-code'];
            this.siteNamesSelected = this.filterAppliedValues['site-name'];
            this.siteLabelsSelected = this.filterAppliedValues['site-label'];
            this.siteHierarchySelected = this.filterAppliedValues['site-directory'];
            this.filterForm.controls['startDate'].setValue(this.filterAppliedValues['start-date']);
            this.filterForm.controls['endDate'].setValue(this.filterAppliedValues['end-date']);
            this.filterForm.controls['startTime'].setValue(this.filterAppliedValues['start-time']);
            this.filterForm.controls['endTime'].setValue(this.filterAppliedValues['end-time']);
            if(this.filterAppliedValues['include-not-in-catalog']===true){
                this.isChecked = true;
                this.filterForm.controls['excludeInCatalog'].setValue(true);
            }
            let itemLabel = localStorage.getItem('itemLabel');
            let selectedItemLabel = JSON.parse(itemLabel ?? '');
            this.filterForm.controls['itemLabel'].setValue(selectedItemLabel);
        }

        this.filteredSiteLabelOptions = this.filterForm.controls['siteLabel'].valueChanges.pipe(
            startWith(null),
            map((label: string | null) => label ? this._filter(label , 'siteLabel') : this.siteLabels.slice()));

        this.filteredSiteNameOptions = this.filterForm.controls['siteName'].valueChanges.pipe(
            startWith(null),
            map((name: string | null) => name ? this._filter(name , 'siteName') : this.siteNames.slice()));

        this.filteredHierarchyOptions = this.filterForm.controls['hierarchy'].valueChanges.pipe(
            startWith(null),
            map((hierarchy: string | null) => hierarchy ? this._filter(hierarchy ,'hierarchy') : this.siteHierarchy.slice()));

        this.filteredSiteCodeOptions = this.filterForm.controls['siteCode'].valueChanges.pipe(
            startWith(null),
            map((code: string | null) => code ? this._filter(code , 'siteCode') : this.siteCodes.slice()));
        this.subscription = this.filteredSiteCodeOptions.subscribe();

        this.subscriptions.push(
            this.filteredSiteLabelOptions.subscribe(),
            this.filteredSiteNameOptions.subscribe(),
            this.filteredHierarchyOptions.subscribe(),
            this.filteredSiteCodeOptions.subscribe()
        );
    }

    private _filter(value: string , formName : string): string[] {
        const filterValue = value.toString().toLowerCase();

        if (formName == 'siteCode') {
            return this.siteCodes.filter(siteCode => siteCode.toLowerCase().indexOf(filterValue) >= 0);
        }
        else if (formName == 'siteLabel') {
            return this.siteLabels.filter(label => label.toLowerCase().indexOf(filterValue) >= 0);
        }
        else if (formName == 'siteName') {
            return this.siteNames.filter(name => name.toLowerCase().indexOf(filterValue) >= 0);
        }
        else {
            return this.siteHierarchy.filter(hierarchy => hierarchy.toLowerCase().indexOf(filterValue) >= 0);
        }
    }


    addSiteDataForSiteHierarchy(event: Partial<MatChipInputEvent>): void {
        const input = event.chipInput;

        if (input) {
            const value = event.value;
            const inputValue = value?.trim();
            if (inputValue) {
                if (!this.siteHierarchySelected.includes(inputValue)) {
                    this.siteHierarchySelected.push(inputValue);
                }
            }
            input.id = '';
        }
        this.filterForm.controls['hierarchy'].setValue(null);
    }

    addSiteDataForSiteLabel(event: Partial<MatChipInputEvent>): void {
        const input = event.chipInput;

        if (input) {
            const value = event.value;
            const inputValue = value?.trim();
            if (inputValue) {
                if (!this.siteLabelsSelected.includes(inputValue)) {
                    this.siteLabelsSelected.push(inputValue);
                }
            }
            input.id = '';
        }
        this.filterForm.controls['siteLabel'].setValue(null);
    }

    addSiteDataForSiteName(event: Partial<MatChipInputEvent>): void {
        const input = event.chipInput;

        if (input) {
            const value = event.value;
            const inputValue = value?.trim();
            if (inputValue) {
                if (!this.siteNamesSelected.includes(inputValue)) {
                    this.siteNamesSelected.push(inputValue);
                }
            }
            input.id = '';
        }
        this.filterForm.controls['siteName'].setValue(null);
    }

    addSiteDataForSiteCode(event: Partial<MatChipInputEvent>): void {
        const input = event.chipInput;

        if (input) {
            const value = event.value;
            const inputValue = value?.trim();
            if (inputValue) {
                if (!this.siteCodesSelected.includes(inputValue)) {
                    this.siteCodesSelected.push(inputValue);
                }
            }
            input.id = '';
        }
        this.filterForm.controls['siteCode'].setValue(null);
    }

    removeSiteCode (removedSiteCode: string)
    {
        this.siteCodesSelected = [...this.siteCodesSelected.filter(siteCode => siteCode !== removedSiteCode)];
        this.updateOtherFieldsBasesOnSiteCode();
        this.updateSiteLabelsValue();

    }
    removeSiteName (removedSiteName: string)
    {
        this.siteNamesSelected = [...this.siteNamesSelected.filter(siteName => siteName !== removedSiteName)];
        this.updateOtherFieldsBasesOnSiteName();
        this.updateSiteLabelsValue();
    }

    removeSiteLabel (removedSiteLabel: string)
    {
        this.siteLabelsSelected = [...this.siteLabelsSelected.filter(siteLabel => siteLabel !== removedSiteLabel)];
        this.updateOtherFieldsBasesOnSiteLabel()
        this.updateSiteLabelsValue();
    }

    removeSiteHierarchy(removedHierarchy: string)
    {
        this.siteHierarchySelected = [...this.siteHierarchySelected.filter(hierarchy => hierarchy !== removedHierarchy)];
        this.updateOtherFieldsBasesOnSiteHierarchy();
        this.updateSiteLabelsValue();


    }

    updateSiteLabelsValue ()
    {
        if (this.siteHierarchySelected.length === 0 && this.siteNamesSelected.length === 0
            && this.siteCodesSelected.length === 0 && this.siteLabelsSelected.length === 0) {
            this.reset();
            this.filterForm.controls['siteName'].reset();
            this.filterForm.controls['siteCode'].reset();
            this.filterForm.controls['siteLabel'].reset();
            this.filterForm.controls['hierarchy'].reset();
        }

        if (this.siteHierarchySelected.length === 0 && this.siteNamesSelected.length === 0
            && this.siteCodesSelected.length === 0 && this.siteLabelsSelected.length !== 0) {
            this.reset(false);
            this.updateSiteCodesFromSiteArrayMap(this.siteLabelsSelected, this.siteApiResponseService.labelMap);
            this.updateSiteHierarchyFromSiteArrayMap(this.siteLabelsSelected, this.siteApiResponseService.labelMap);
            this.updateSiteNamesFromSiteArrayMap(this.siteLabelsSelected, this.siteApiResponseService.labelMap);
            this.filterForm.controls['siteName'].reset();
            this.filterForm.controls['siteCode'].reset();
            this.filterForm.controls['hierarchy'].reset();
        }
        const lengthsArray = [];
        lengthsArray.push(this.siteHierarchySelected.length, this.siteNamesSelected.length, this.siteCodesSelected.length, this.siteLabelsSelected.length);
        // if only 1 item is selected out of the fields, time to reset
        if (lengthsArray.filter(length => length != 0).length == 1) {
            if (this.siteHierarchySelected.length > 0) {
                this.siteApiResponseService.hierarchyMap = new Map<string, Site>(JSON.parse(localStorage.getItem("hierarchyMap")!));
                this.siteHierarchy = Array.from(this.siteApiResponseService.hierarchyMap.keys());
                this.filterForm.controls['hierarchy'].reset();
            }
            if (this.siteNamesSelected.length > 0) {
                this.siteApiResponseService.nameMap = new Map<string, Site>(JSON.parse(localStorage.getItem("nameMap")!));
                this.siteNames = Array.from(this.siteApiResponseService.nameMap.keys());
                this.filterForm.controls['siteName'].reset();
            }
            if (this.siteCodesSelected.length > 0) {
                this.siteApiResponseService.siteCodeMap = new Map<string, Site>(JSON.parse(localStorage.getItem("siteCodeMap")!));
                this.siteCodes = Array.from(this.siteApiResponseService.siteCodeMap.keys());
                this.filterForm.controls['siteCode'].reset();
            }
            if (this.siteLabelsSelected.length > 0) {
                this.siteApiResponseService.labelMap = new Map<string, Site[]>(JSON.parse(localStorage.getItem("labelMap")!));
                this.siteLabels = Array.from(this.siteApiResponseService.labelMap.keys());
                this.filterForm.controls['siteLabel'].reset();
            }

        }
    }
    updateOtherFieldsBasesOnSiteCode()
    {
        this.updateSiteLabels(this.siteCodesSelected.length === 0 ?
            this.siteCodes : this.siteCodesSelected, this.siteApiResponseService.siteCodeMap);
        this.updateSiteHierarchy(this.siteCodesSelected.length === 0 ?
            this.siteCodes : this.siteCodesSelected, this.siteApiResponseService.siteCodeMap);
        this.updateSiteNames(this.siteCodesSelected.length === 0 ?
            this.siteCodes : this.siteCodesSelected, this.siteApiResponseService.siteCodeMap);
    }

    updateOtherFieldsBasesOnSiteName()
    {
        this.updateSiteCodes(this.siteNamesSelected.length === 0 ?
            this.siteNames : this.siteNamesSelected, this.siteApiResponseService.nameMap);
        this.updateSiteLabels(this.siteNamesSelected.length === 0 ?
            this.siteNames : this.siteNamesSelected, this.siteApiResponseService.nameMap);
        this.updateSiteHierarchy(this.siteNamesSelected.length === 0 ?
            this.siteNames : this.siteNamesSelected, this.siteApiResponseService.nameMap);
    }
    updateOtherFieldsBasesOnSiteLabel()
    {
        this.updateSiteNamesFromSiteArrayMap(this.siteLabelsSelected.length === 0 ?
            this.siteLabels : this.siteLabelsSelected, this.siteApiResponseService.labelMap);
        this.updateSiteCodesFromSiteArrayMap(this.siteLabelsSelected.length === 0 ?
            this.siteLabels : this.siteLabelsSelected, this.siteApiResponseService.labelMap);
        this.updateSiteHierarchyFromSiteArrayMap(this.siteLabelsSelected.length === 0 ?
            this.siteLabels : this.siteLabelsSelected, this.siteApiResponseService.labelMap);
    }
    updateOtherFieldsBasesOnSiteHierarchy()
    {
        this.updateSiteCodes(this.siteHierarchySelected.length === 0 ?
            this.siteHierarchy : this.siteHierarchySelected, this.siteApiResponseService.hierarchyMap);
        this.updateSiteLabels(this.siteHierarchySelected.length === 0 ?
            this.siteHierarchy : this.siteHierarchySelected, this.siteApiResponseService.hierarchyMap);
        this.updateSiteNames(this.siteHierarchySelected.length === 0 ?
            this.siteHierarchy : this.siteHierarchySelected, this.siteApiResponseService.hierarchyMap);
    }
    reset(resetLabels:boolean=true) {

        const labelMapString = localStorage.getItem("labelMap");
        if (labelMapString && resetLabels) {
            this.siteApiResponseService.labelMap = new Map<string, Site[]>(JSON.parse(labelMapString));
            this.siteLabels = Array.from(this.siteApiResponseService.labelMap.keys());
        }
        const hierarchyMapString = localStorage.getItem("hierarchyMap");
        if (hierarchyMapString) {
            this.siteApiResponseService.hierarchyMap = new Map<string, Site>(JSON.parse(hierarchyMapString));
            this.siteHierarchy = Array.from(this.siteApiResponseService.hierarchyMap.keys());
        }
        const nameMapString = localStorage.getItem("nameMap");
        if (nameMapString) {
            this.siteApiResponseService.nameMap = new Map<string, Site>(JSON.parse(nameMapString));
            this.siteNames = Array.from(this.siteApiResponseService.nameMap.keys());
        }
        const siteCodeMapString = localStorage.getItem("siteCodeMap");
        if (siteCodeMapString) {
            this.siteApiResponseService.siteCodeMap = new Map<string, Site>(JSON.parse(siteCodeMapString));
            this.siteCodes = Array.from(this.siteApiResponseService.siteCodeMap.keys());
        }
    }

    selectedSiteCode(event: MatAutocompleteSelectedEvent): void
    {
        const newValue = event.option.viewValue;
        // Below code will differentiate where select or remove is invoked
        if (this.siteCodesSelected.includes(newValue)) {
            this.removeSiteCode(newValue);
            this.filterForm.controls['siteCode'].reset();
            return;
        } else {
            this.siteCodesSelected.push(event.option.viewValue);
        }

        this.updateSiteLabels(this.siteCodesSelected, this.siteApiResponseService.siteCodeMap);
        this.updateSiteHierarchy(this.siteCodesSelected, this.siteApiResponseService.siteCodeMap);
        this.updateSiteNames(this.siteCodesSelected, this.siteApiResponseService.siteCodeMap);

        this.siteCodeInput.nativeElement.value = '';

        this.filterForm.controls['siteCode'].setValue(null);

        // keep the autocomplete opened after each item is picked.
        requestAnimationFrame(()=>{
            this.openAuto(this.sideCodeACTrigger, 'siteCode');
        })

        this.filterForm.controls['siteCode'].setValue(null);


    }

    selectedSiteName (event: MatAutocompleteSelectedEvent): void
    {
        const newValue = event.option.viewValue;

        if (this.siteNamesSelected.includes(newValue)) {
            this.removeSiteName(newValue);
            this.filterForm.controls['siteName'].reset();
            return;
        } else {
            this.siteNamesSelected.push(event.option.viewValue);
        }

        this.updateSiteCodes(this.siteNamesSelected, this.siteApiResponseService.nameMap);
        this.updateSiteLabels(this.siteNamesSelected, this.siteApiResponseService.nameMap);
        this.updateSiteHierarchy(this.siteNamesSelected, this.siteApiResponseService.nameMap);

        this.siteNameInput.nativeElement.value = '';
        // keep the autocomplete opened after each item is picked.
        requestAnimationFrame(()=>{
            this.openAuto(this.sideNameACTrigger, 'siteName');
        })
        this.filterForm.controls['siteName'].setValue(null);
    }

    selectedSiteLabel (event: MatAutocompleteSelectedEvent): void
    {
        const newValue = event.option.viewValue;
        if (this.siteLabelsSelected.includes(newValue)) {
            this.removeSiteLabel(newValue);
            this.filterForm.controls['siteLabel'].reset();
            return;
        } else {
            this.siteLabelsSelected.push(event.option.viewValue);
        }

        this.updateSiteCodesFromSiteArrayMap(this.siteLabelsSelected, this.siteApiResponseService.labelMap);
        this.updateSiteHierarchyFromSiteArrayMap(this.siteLabelsSelected, this.siteApiResponseService.labelMap);
        this.updateSiteNamesFromSiteArrayMap(this.siteLabelsSelected, this.siteApiResponseService.labelMap);

        this.siteLabelInput.nativeElement.value = '';
        this.filterForm.controls['siteLabel'].setValue(null);

        // keep the autocomplete opened after each item is picked.
        requestAnimationFrame(()=>{
            this.openAuto(this.sideLabelACTrigger, 'siteLabel');
        })
        this.filterForm.controls['siteLabel'].setValue(null);
    }

    selectedSiteHierarchy (event: MatAutocompleteSelectedEvent): void
    {
        const newValue = event.option.viewValue;

        if (this.siteHierarchySelected.includes(newValue)) {
            this.removeSiteHierarchy(newValue);
            this.filterForm.controls['hierarchy'].reset();
            return;
        } else {
            this.siteHierarchySelected.push(event.option.viewValue);
        }

        this.updateSiteCodes(this.siteHierarchySelected, this.siteApiResponseService.hierarchyMap);
        this.updateSiteLabels(this.siteHierarchySelected, this.siteApiResponseService.hierarchyMap);
        this.updateSiteNames(this.siteHierarchySelected, this.siteApiResponseService.hierarchyMap);

        this.hierarchyInput.nativeElement.value = '';
        this.filterForm.controls['hierarchy'].setValue(null);

        // keep the autocomplete opened after each item is picked.
        requestAnimationFrame(()=>{
            this.openAuto(this.matACTrigger, 'hierarchy');
        })
        this.filterForm.controls['hierarchy'].setValue(null);

    }


    updateSiteHierarchy(newValues : string[], map: Map<string, Site>) {
        this.siteHierarchy = [];
        this.siteHierarchySelected.forEach(value => {
            this.siteHierarchy.push(value);
        })
        newValues.forEach(value => {
            if (!this.siteHierarchy.includes(map.get(value)?.["geo-location"].hierarchy!)) {
                this.siteHierarchy.push(map.get(value)?.["geo-location"].hierarchy!);
            }
        })
        this.filterForm.controls['hierarchy'].reset();
    }

    updateSiteLabels(newValues : string[], map: Map<string, Site>) {
        this.siteLabels = [];
        // existing selected values shouldn't lost
        this.siteLabelsSelected.forEach(value => {
            this.siteLabels.push(value);
        })
        newValues.forEach(value => {
            map.get(value)?.labels!.forEach(l => {
                if (!this.siteLabels.includes(l)) {
                    this.siteLabels.push(l);
                }
            })

        })
        this.filterForm.controls['siteLabel'].reset();
    }

    updateSiteCodes(newValues : string[], map: Map<string, Site>) {
        this.siteCodes = [];
        // existing selected values shouldn't lost
        this.siteCodesSelected.forEach(value => {
            this.siteCodes.push(value);
        })
        newValues.forEach(value => {
            if (!this.siteCodes.includes(map.get(value)?.code!)) {
                this.siteCodes.push(map.get(value)?.code!);
            }
        })
        this.filterForm.controls['siteCode'].reset();
    }

    updateSiteNames(newValues : string[], map: Map<string, Site>) {
        this.siteNames = [];
        // existing selected values shouldn't lost
        this.siteNamesSelected.forEach(value => {
            this.siteNames.push(value);
        })

        newValues.forEach(value => {
            if (!this.siteNames.includes(map.get(value)?.name!)) {
                this.siteNames.push(map.get(value)?.name!);
            }
        })
        this.filterForm.controls['siteName'].reset();
    }

    updateSiteNamesFromSiteArrayMap(newValues : string[], map: Map<string, Site[]>) {
        let tempSiteNames = this.siteNames
        this.siteNames =[]
        newValues.forEach(value => {
            map.get(value)?.forEach(l => {
                if (!this.siteNames.includes(l.name)
                    && tempSiteNames.includes(l.name)) {
                    this.siteNames.push(l.name);
                }
            })
        })
        this.filterForm.controls['siteName'].reset();
    }

    updateSiteCodesFromSiteArrayMap(newValues : string[], map: Map<string, Site[]>) {
        let tempSiteCodes = this.siteCodes;
        this.siteCodes = []
        newValues.forEach(value => {
            map.get(value)?.forEach(l => {
                if (!this.siteCodes.includes(l.code)
                    && tempSiteCodes.includes(l.code)) {
                    this.siteCodes.push(l.code);
                }
            })
        })
        this.filterForm.controls['siteCode'].reset();
    }

    updateSiteHierarchyFromSiteArrayMap(newValues : string[], map: Map<string, Site[]>) {
        let tempSiteHierarchy = this.siteHierarchy;
        this.siteHierarchy =[]
        newValues.forEach(value => {
            map.get(value)?.forEach(l => {
                if (!this.siteHierarchy.includes(l["geo-location"].hierarchy)
                    && tempSiteHierarchy.includes(l["geo-location"].hierarchy)) {
                    this.siteHierarchy.push(l["geo-location"].hierarchy);
                }
            })
        })
        this.filterForm.controls['hierarchy'].reset();
    }

    openAuto(trigger: MatAutocompleteTrigger , formName : string) {

        if (formName == 'siteCode') {
            trigger.openPanel();
            this.siteCodeInput.nativeElement.focus();
        }
        else if (formName == 'siteName') {
            trigger.openPanel();
            this.siteNameInput.nativeElement.focus();
        }
        else if (formName == 'siteLabel') {
            trigger.openPanel();
            this.siteLabelInput.nativeElement.focus();
        }
        else {
            trigger.openPanel();
            this.hierarchyInput.nativeElement.focus();
        }
    }

    clearFilter() {
        this.isChecked = false;
        this.siteCodesSelected = [];
        this.siteNamesSelected = [];
        this.siteHierarchySelected = [];
        this.siteLabelsSelected = [];
        this.filterForm.reset();
        localStorage.setItem('isFilterApplied','false');
        this.sendFilterAction(false, true);
        this.ngOnInit();
    }

    onChange(event: any) {
        let checked = event.checked;
        this.filterForm.controls['excludeInCatalog'].setValue(checked);
    }

    onFormSubmit(testCase : boolean = false) {
        this.filterApplied = true;
        const startDateValue = this.filterForm.get('startDate')?.value;
        const endDateValue = this.filterForm.get('endDate')?.value;
        const filterFields: FilterFields = {
            "start-date": startDateValue ? this.datePipe.transform(new Date(startDateValue), 'yyyy-MM-dd') : null,
            "end-date": endDateValue ? this.datePipe.transform(new Date(endDateValue), 'yyyy-MM-dd') : null,
            "start-time": this.filterForm.get('startTime')?.value,
            "end-time": this.filterForm.get('endTime')?.value,
            "site-code": this.siteCodesSelected,
            "site-name": this.siteNamesSelected,
            "site-label": this.siteLabelsSelected,
            "itemLabel": this.filterForm.get('itemLabel')?.value,
            "include-not-in-catalog": this.filterForm.get('excludeInCatalog')?.value,
            "site-directory" : this.siteHierarchySelected
        };
        localStorage.setItem('itemLabel', JSON.stringify(this.filterForm.controls['itemLabel'].value));
        localStorage.setItem('filterValues', JSON.stringify(filterFields));
        localStorage.setItem("isFilterApplied", String(this.filterApplied));
       this.sendFilterAction(true, false);
        if (!testCase) {
            this.dilogRef.close('save');
        }
    }

    sendFilterAction(applied:boolean, clearAction:boolean ){
        const updateFilter:FilterChange = {
            applied: applied,
            clearAction: clearAction,
            pageUrl: this.router.url
        };
        this.commonService.sendFilterAppliedValue(updateFilter);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}
