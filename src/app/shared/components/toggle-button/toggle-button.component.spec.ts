import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleButtonComponent } from './toggle-button.component';
import { MaterialModule } from '../../module/material.module';
import { FormsModule } from '@angular/forms';

describe('ToggleButtonComponent', () => {
  let component: ToggleButtonComponent;
  let fixture: ComponentFixture<ToggleButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleButtonComponent],
      imports: [MaterialModule,FormsModule],
    });

    fixture = TestBed.createComponent(ToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit viewValue on toggle', () =>{
    spyOn(component.toggleValue,'emit')
    component.onToggle('chart')
    expect(component.toggleValue.emit).toHaveBeenCalledWith('chart')
  })

  it('should emit download file type pdf when onDownloadClick called', () =>{
    component.viewType = 'chart'
    spyOn(component.onDownload,'emit')
    component.onDownloadClick()
    expect(component.onDownload.emit).toHaveBeenCalledWith('pdf')
  })

  it('should emit download file type exl when onDownloadClick called', () =>{
    component.viewType = 'table'
    spyOn(component.onDownload,'emit')
    component.onDownloadClick()
    expect(component.onDownload.emit).toHaveBeenCalledWith('excel')
  })
});
