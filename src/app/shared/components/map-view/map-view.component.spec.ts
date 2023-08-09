import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewComponent } from './map-view.component';

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;
  
  const mapData = [{
    "site-code": "Site Name 1",
    "shrink-event-count": 143,
    "shrink-item-ratio": 0.27,
    "bulk-event-ratio": 0.27,
    "shrink-event-trend": 685.33,
    "site-name": "Site Name 1",
    "coordinates": {
        "latitude": -0.3372032,
        "longitude": 103.3702811
    }
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapViewComponent]
    });
    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call mapInitializer function', () => {
    spyOn(component,'mapInitializer');
    component.ngAfterViewInit();
    expect(component.mapInitializer).toHaveBeenCalled();
  });

  it('should call loadAllMarkers function', () => {
    spyOn(component,'loadAllMarkers');
    component.mapInitializer();
    expect(component.loadAllMarkers).toHaveBeenCalled();
  });

  it('should add marker for each value to the array', () => {
    component.mapData = mapData;
    component.ngOnChanges();
    expect(component.mapData.length).not.toEqual(0);
  });

  it('should emit map id', () => {
    spyOn(component.mapId,'emit');
    component.sendMapId('map');
    expect(component.mapId.emit).toHaveBeenCalled();
  });
});
