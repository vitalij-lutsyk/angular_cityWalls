import { Component, OnInit, Input } from '@angular/core';
import { DbService } from '../../services/db.service';
import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { Subscription, from } from 'rxjs';
import { UserObj } from '../../services/userObj';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DbService]
})
export class MapComponent implements OnInit {
  map: any;
  osmAttr =
    '&copy; <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>, ' +
    'Tiles courtesy of <a href=\'http://hot.openstreetmap.org/\' target=\'_blank\'>Humanitarian OpenStreetMap Team</a>';
  constructor(private db: DbService) {}
  objects: UserObj[];
  subscription: Subscription;
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

  ngOnInit() {
    this.createMap();
    this.subscribeIt();
  }
  subscribeIt() {
    this.db.fetchData();
    for (const key of this.db.objects) {
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
    this.initMap(this.geojson);
  }
  createMap() {
    this.map = L.map('mapAll').setView([49.842122, 24.051401], 14);
    const basemap = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: this.osmAttr
      }
    ).addTo(this.map);
  }

  initMap(a) {
    const geojsonLayer = L.geoJSON(<GeoJsonObject>a, {
      style: function(feature) {
        return {
          color: feature.properties.GPSUserColor
        };
      },
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius: 5,
          fillOpacity: 0.85
        });
      },
      onEachFeature: function popUp(f, l) {
        let key;
        const out = [];
        if (f.properties) {
          for (key in f.properties) {
            if (key === 'imagePreview') {
              out.push(
                '<img src="' +
                  f.properties[key] +
                  '" alt="" style="width:300px; height: 200px; margin: 0">'
              );
            } else {
              out.push(key + ': ' + f.properties[key]);
            }
          }
          l.bindPopup(out.join('<br />'));
        }
      }
    });
    geojsonLayer.addTo(this.map);
  }
}
