import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {
  @ViewChild("mapContainer", { static: false }) gmap!: ElementRef;
  @Input() mapData: any;
  @Output() mapId: EventEmitter<string> = new EventEmitter<string>();

  map!: google.maps.Map;
  lat = 40.73061;
  lng = -73.935242;

  markers: any[]=[];

  coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: localStorage.getItem('isFilterApplied') === 'true'? 5 : 2,
    disableDefaultUI: true,
    zoomControl: true,
    maxZoom: 10,
    minZoom: 2,
    keyboardShortcuts: false,
  };

  constructor(private router:Router){}

  ngOnChanges(){
    if(this.mapData[0].coordinates.latitude){
      this.mapOptions.center = new google.maps.LatLng(this.mapData[0].coordinates.latitude,this.mapData[0].coordinates.longitude);
    }
    this.mapData.forEach((item: any)=>{ 
      this.markers.push({
        position: new google.maps.LatLng(item?.coordinates?.latitude, item?.coordinates?.longitude),
        map: this.map,
      })
    });
    this.sendMapId('map');
  }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.loadAllMarkers();
  }

  loadAllMarkers(): void {
    this.markers.forEach((markerInfo,index) => {
      //Creating a new marker object
      const marker = new google.maps.Marker({
        ...markerInfo
      });

      const contentString =
        '<div id="content" style="width:180px;">' +
        '<div id="siteName" style="font-weight:700;height:30px;">' + this.mapData[index]["site-name"]+
        "</div>" +
        "<div> </div>"+
        '<div id="bodyContent">'  +
        '<div style="display:flex;justify-content:space-between;line-height:24px;">'+
        '<div>Total Shrink Items</div>'+
        '<div style="font-weight:700;">' + 
        this.mapData[index]["shrink-event-count"] + '</div>' +
        '</div>'+
        '<div style="display:flex;justify-content:space-between;line-height:24px;">'+
        '<div>Bulk Events</div>'+
        '<div style="font-weight:700;">' + 
        this.mapData[index]["bulk-event-ratio"] + '</div>' +
        '</div>'+
        '<div style="display:flex;justify-content:space-between;line-height:24px;">'+
        '<div>% Change in Shrink</div>'+
        '<div style="font-weight:700;">' + 
        this.mapData[index]["shrink-event-trend"] + '</div>' +
        "</div>" +
        "</div>" +
        "</div>";

      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });

      marker.addListener("mouseover", () => {
        infoWindow.open(marker.getMap(), marker);
      });

      marker.addListener("mouseout", () => {
        infoWindow.close();
      });

      marker.addListener("click", () => {
        this.router.navigate(['/dashboard/rfid-exit-read'],{
          queryParams: { siteId:  this.mapData[index]["site-code"] }
        });
      });

      //Adding marker to google map
      marker.setMap(this.map);
    });

  }

  sendMapId(id: string){
    this.mapId.emit(id);
  }
}
