import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularViewComponent } from './tabular-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { ShrinkBySites } from 'src/app/modules/shrink-visibility/shrink-visibility.model';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {MatSelect} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";

describe('TabularViewComponent', () => {
  let component: TabularViewComponent;
  let fixture: ComponentFixture<TabularViewComponent>;
  let router: Router;
  let mockMatSelect: Partial<MatSelect>;

  beforeEach(() => {
    mockMatSelect = { writeValue: jasmine.createSpy('writeValue') };
    TestBed.configureTestingModule({
      declarations: [TabularViewComponent],
      imports: [RouterTestingModule, AgGridModule],
      providers: [{ provide: MatSelect, useValue: mockMatSelect }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TabularViewComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columnIds correctly', () => {
    component.tableHeaders = [
      { colId: 'col1', headerName: 'Column 1' },
      { colId: 'col2', headerName: 'Column 2' },
      { headerName: 'Column 3' }
    ];
    component.ngOnInit();
    expect(component.columnIds).toEqual(['col1', 'col2']);
  });

  it('should set selected columns visible and other columns invisible', () => {
    const selectedColumns = ['column1', 'column2'];
    const tableHeaders = [
      { colId: 'column1', headerName: 'Column 1' },
      { colId: 'column2', headerName: 'Column 2' },
      { colId: 'column3', headerName: 'Column 3' }
    ];

    spyOn(component.agGrid.columnApi, 'setColumnsVisible');
    component.tableHeaders = tableHeaders;
    component.onColumnSelectionChange({ value: selectedColumns }, '' as any);

    expect(component.agGrid.columnApi.setColumnsVisible).toHaveBeenCalledWith(['column1', 'column2', 'column3'], false);
    expect(component.agGrid.columnApi.setColumnsVisible).toHaveBeenCalledWith(selectedColumns, true);
  });

  it('should prevent unchecking of selected columns when there are less than 2 columns selected', () => {
    const selectedColumns = ['column1', 'column2'];
    const tableHeaders = [
      { colId: 'column1', headerName: 'Column 1' },
      { colId: 'column2', headerName: 'Column 2' },
      { colId: 'column3', headerName: 'Column 3' }
    ];

    spyOn(component.agGrid.columnApi, 'setColumnsVisible');
    component.tableHeaders = tableHeaders;
    const mockEvent = { value: selectedColumns };

    component.onColumnSelectionChange(mockEvent, mockMatSelect as MatSelect);
    const newSelectedColumns = ['column1']
    const mockEventUncheck = { value: newSelectedColumns };
    component.onColumnSelectionChange(mockEventUncheck, mockMatSelect as MatSelect);
    expect(component.columnIds).toEqual(selectedColumns);
    expect(component.agGrid.columnApi.setColumnsVisible).toHaveBeenCalledWith(['column1', 'column2', 'column3'], false);
    expect(component.agGrid.columnApi.setColumnsVisible).toHaveBeenCalledWith(selectedColumns, true);
  });

  it('should set navigate the user to bulk shrink events', () => {
    spyOn(router,'navigateByUrl');
    const data = {
        "hour-of-day": 4,
        "shrink-event-count": 892,
        "bulk-event-count": 44,
        "sweetheart-count": 533
    };
    component.onCellClicked(data,'bulkEventCount')
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should set navigate the user', () => {
    spyOn(router,'navigateByUrl');
    const data = {
        "hour-of-day": 4,
        "shrink-event-count": 892,
        "bulk-event-count": 44,
        "sweetheart-count": 533
    };
    component.onCellClicked(data,'totalShrinkEvents')
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should set navigate the user to rfid-exit-read with site code', () => {
    spyOn(router,'navigateByUrl');
    let data: ShrinkBySites[] = [
      {
        'site-code': 'SiteCode1',
        'shrink-event-count': 10,
        'shrink-item-ratio': 0.5,
        'bulk-event-ratio': 0.2,
        'shrink-event-trend': 42
      },
      {
        'site-code': 'SiteCode2',
        'shrink-event-count': 15,
        'shrink-item-ratio': 0.8,
        'bulk-event-ratio': 0.3,
        'shrink-event-trend': 89
      },
    ];
    component.onCellClicked(data,'siteId')
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should set navigate the user to rfid-exit-read for sweetheart count', () => {
    spyOn(router,'navigateByUrl');
    const data = {
        "hour-of-day": 4,
        "shrink-event-count": 892,
        "bulk-event-count": 44,
        "sweetheart-count": 533
    };
    component.onCellClicked(data,'sweetheartCount')
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
