import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Map, Polygon, Circle, Marker } from 'leaflet';

@Component({
  selector: 'app-home',
  template: `<h3>{{ message }}</h3><div id="map"></div>`
})
export class HomeComponent implements OnInit {
  public message: string;
  private map: Map;
  private circle: Circle;
  private polygon: Polygon;
  private marker: Marker;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    if (this.mapService.L) {
      // Leaflet is loaded - load the map!
      this.message = 'Map Loaded';

      this.setupMap();
    } else {
      // When the server renders it, it'll show this.
      this.message = 'Map not loaded';
    }
  }

  private setupMap() {
    // Create the map in the #map container
    this.map = this.mapService.L.map('map').setView([51.505, -0.09], 13);

    // Add a tilelayer
    this.mapService.L.tileLayer(
      'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {
        attribution:
          'copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,' +
          ' Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }
    ).addTo(this.map);

    this.marker = this.mapService.L.marker([51.5, -0.09]).addTo(this.map);

    this.circle = this.mapService.L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);

    this.polygon = this.mapService.L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(this.map);

    this.marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
    this.circle.bindPopup('I am a circle.');
    this.polygon.bindPopup('I am a polygon.');
  }
}
