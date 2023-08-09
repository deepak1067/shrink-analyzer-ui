import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { BulkShrinkEventsService } from '../../../core/services/bulk-shrink-events/bulk-shrink-events.service';

@Component({
  selector: "app-action-column",
  templateUrl: "./action-column.component.html",
  styleUrls: ["./action-column.component.scss"],
})
export class ActionColumnComponent implements ICellRendererAngularComp {

  constructor(private bulkShrinkEventsService:BulkShrinkEventsService){}

  selectedAction: string ='Organized Crime';
  bulkEventActions = [
    { icon: "assets/svg/OC.svg", name: "Organized Crime" },
    { icon: "assets/svg/ET.svg", name: "External Theft" },
    { icon: "assets/svg/EMP.svg", name: "Employee" },
    { icon: "assets/svg/OS.svg", name: "Omni Sale" },
    { icon: "assets/svg/NaLE.svg", name: "Transfer" },
    { icon: "assets/svg/Transfer.svg", name: "Others" },
    { icon: "assets/svg/Others.svg", name: "Not a loss Event" },
    { icon: "assets/svg/Mixed.svg", name: "Mixed" },
  ];
  public bulkEventCellValue!: any;
  eventId!: string;
  updatedValue!: string;

  agInit(params: ICellRendererParams): void {
    this.bulkEventCellValue = params;
  }

  refresh(params: ICellRendererParams) {
    this.bulkEventCellValue = params;
    return true;
  }

  onUpdateAction(event:any , eventId:string){
    this.bulkEventCellValue.data.Status = event.value
    //post API call with event.value
    //this.bulkShrinkEventsService.setExitEventLabel(eventId ,event.value).subscribe(()=>{})
  }

}
