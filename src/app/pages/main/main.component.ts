import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import * as L from 'leaflet';
import * as firebase from 'firebase';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import { UserObj } from '../../services/userObj';
import { SharedService } from '../../services/shared.service';

import { GalleryComponent } from '../../components/gallery/gallery.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [DbService]
})
export class MainComponent implements OnInit, AfterContentInit, OnDestroy {
  constructor(
    public auth: AuthService,
    private modalService: NgbModal,
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

  // Group functions, related with voting

  // Main function realization voting
  // Accepting 2 argumaents- composition id and  what vote you want set (good or bad)
  voter(id, b) {
    // this commented function need in develop proccess. This function clear all vote from all composition
    // this.clearRating();
    let isVoting = false; // var, that define, did you vote some composition
    let simpleVoter: any;
    const votingRef = firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/' + b);
    firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/')
      .on('value', s => {
        if (s.val() !== null) {
          // look through rating keys, they are 2 - good i bad.
          for (const key in s.val()) {
            if (s.val()[key] !== null) {
              // look through user vote keys
              for (const i in s.val()[key]) {
                if (s.val()[key][i] === this.auth.userEmail) {
                  isVoting = true;
                  simpleVoter = i;
                }
              }
            }
          }
        }
      });
    // if you don't vote for some composition, calling function voting. else - vote deleting
    if (!isVoting) {
      this.voterThis(votingRef);
    } else {
      this.disVoterThis(votingRef, simpleVoter);
    }
  }
  // function, that set vote on composition. As an argument - the path to where to send a vote is transmitted
  voterThis(ratRef) {
    ratRef.push(this.auth.userEmail);
  }
  // function, that delete vote from composition. As an argument - the path to where to delete vote, and vote id.
  disVoterThis(ratRef, o) {
    ratRef.child(o).set(null);
  }
  // function, that return voter count from composition. first argument - composition id, second - vote.
  // this need to display vote count on composition
  getVoterLength(id, b) {
    let r;
    firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/' + b)
      .on('value', s => {
        r = s.numChildren();
      });
    return r;
  }

  // function, that return color value - green if user voted as good, red if bad, gray if don't voted
  // first argument - composition id, second - vote.
  // this function need to set style on voter buttons
  getStyle(id, b) {
    let isVoted = false;
    let howVoted;
    firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/')
      .on('value', s => {
        if (s.val() !== null) {
          const keys = Object.keys(s.val());
          for (const key of keys) {
            if (s.val()[key] !== null) {
              for (const i in s.val()[key]) {
                if (s.val()[key][i] === this.auth.userEmail) {
                  isVoted = true;
                  howVoted = key;
                }
              }
            }
          }
        }
      });
    if (isVoted && howVoted === 'good' && b === 'good') {
      return 'green';
    } else if (isVoted && howVoted === 'bad' && b === 'bad') {
      return 'red';
    } else {
      return 'gray';
    }
  }

  // function clear all vote from all composition
  clearRating() {
    firebase
      .database()
      .ref('objects/')
      .on('value', o => {
        if (o.val() !== null) {
          for (const obj in o.val()) {
            if (obj) {
              firebase
                .database()
                .ref('objects/' + obj)
                .child('properties/rating/')
                .set(null);
            }
          }
        }
      });
  }

  // function, that open modal with carousel with more detail description of composition
  // as argument acceptind serial number of composition, that user has clicked
  openGallery(i) {
    // next sharing serial number of composition, that user has clicked
    // in gallery component, this value accepted, and set as started first slide
    this.share.setActive(i);
    const modalRef = this.modalService.open(GalleryComponent, {
      size: 'lg'
    });
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
