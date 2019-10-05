import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { UserObj } from '../../services/userObj';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [DbService]
})
export class MainComponent implements OnInit, AfterContentInit, OnDestroy {
  constructor(
    public auth: AuthService,
    private db: DbService,
    public share: SharedService
  ) {}

  objects: UserObj[];
  subscription: Subscription;

  types = ['Графіті', 'Мурал', 'Вірш', 'Реклама', 'Тег', 'Вандалізм'];
  marker: any;
  map: any;
  mobile: boolean;

  // structure of data, which need for adding objects to the maps
  geojson = {
    type: 'FeatureCollection',
    crs: {
      type: 'Name',
      properties: {
        Name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    },
    features: []
  };

  // creating map
  createMap() {
    this.map = L.map('map').setView([49.84, 24.03], 13);
    const basemap = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo(this.map);
  }
  // moving map to object location, creates and opens popup. The argument accepts the key of an object over which the mouse is located.
  panToMarkerLocation(el) {
    const sight = L.icon({
      iconUrl: '../../assets/sight.png',
      iconSize: [50, 50], // size of the icon
      iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -25] // point from which the popup should open relative to the iconAnchor
    });
    for (const key in this.objects) {
      if (el === this.objects[key]) {
        this.marker = L.marker(
          [
            this.objects[key].geometry.coordinates[0],
            this.objects[key].geometry.coordinates[1]
          ],
          {
            icon: sight
          }
        );
        this.marker
          .addTo(this.map)
          .bindPopup('It`s here')
          .openPopup();
        this.map.setView(
          [
            this.objects[key].geometry.coordinates[0],
            this.objects[key].geometry.coordinates[1]
          ],
          18
        );
      }
    }
  }
  // delete marker, if mouse leaves this object
  removeMarker() {
    this.map.removeLayer(this.marker);
  }

  ngOnInit() {
    this.db.fetchData();
    this.subscription = this.db.newObject.subscribe((objects: UserObj[]) => {
      this.objects = objects;
      for (const key of objects) {
        const mapObj = {
          type: 'Feature',
          properties: key.properties,
          geometry: {
            type: 'Point',
            coordinates: [
              key.geometry.coordinates[1],
              key.geometry.coordinates[0]
            ]
          }
        };
        this.geojson.features.push(mapObj);
      }
    });
    this.createMap();
    if (window.screen.width < 500) {
      this.mobile = true;
    }
  }
  ngAfterContentInit() {
    this.objects = this.db.objects;
  }
  // after destroy Main component - unsubscribe from receiving data from firebase
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
