import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-toggle-button",
  templateUrl: "./toggle-button.component.html",
  styleUrls: ["./toggle-button.component.scss"],
})
export class ToggleButtonComponent {
  @Input() viewType = "chart";
  @Input() showMapIcon: boolean = false;
  @Output() toggleValue = new EventEmitter<string>();
  @Output() onDownload = new EventEmitter<string>();

  onToggle(viewType: string) {
    this.toggleValue.emit(viewType);
  }

  onDownloadClick() {
    if (this.viewType === "chart" || this.viewType === "map") {
      this.onDownload.emit("pdf");
    } else {
      this.onDownload.emit("excel");
    }
  }
}
