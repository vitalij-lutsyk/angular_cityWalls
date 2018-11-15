import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from '../../services/storage.service';

import * as firebase from 'firebase';
import * as L from 'leaflet';

@Component({
  selector: 'app-add-new-composition',
  templateUrl: './add-new-composition.component.html',
  styleUrls: ['./add-new-composition.component.css']
})
export class AddNewCompositionComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private storage: StorageService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {}

  types: Array<string> = [
    'Графіті',
    'Мурал',
    'Вірш',
    'Реклама',
    'Тег',
    'Вандалізм'
  ];
  locationTypes: Array<string> = [
    'Стіна житлового будинку',
    'Частина стіни житлового будинку',
    'Паркан',
    'МАФ',
    'Рухомий обєкт'
  ];
  map: any;
  myMarker: any;
  exportCoord: any;
  userForm: FormGroup;
  userImage: any;
  userPreviewImage: any;
  userImageURL: any;
  userPreviewImageURL: any;

  osmAttr =
    '&copy; <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>, ' +
    'Tiles courtesy of <a href=\'http://hot.openstreetmap.org/\' target=\'_blank\'>Humanitarian OpenStreetMap Team</a>';
  sight = L.icon({
    iconUrl: '../../assets/sight.png',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -25] // point from which the popup should open relative to the iconAnchor
  });
  ngOnInit() {
    this.initForm();
    this.createMap();
  }

  // function, that initialize form
  initForm() {
    this.userForm = new FormGroup({
      name: new FormControl(''),
      author: new FormControl(''),
      type: new FormControl('', Validators.required),
      locationType: new FormControl('', Validators.required),
      address: new FormGroup({
        country: new FormControl(''),
        city: new FormControl(''),
        street: new FormControl(''),
        house: new FormControl('')
      }),
      description: new FormControl('')
    });
  }

  // function, that create map of object location
  createMap() {
    this.map = L.map('mapAdd').setView([49.84, 24.03], 10);
    const basemap = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: this.osmAttr
      }
    ).addTo(this.map);
    this.myMarker = L.marker([49.84, 24.03], {
      icon: this.sight,
      draggable: true
    })
      .addTo(this.map)
      .on('dragend', () => {
        // on marker dragging - return running coordinates
        this.getCurrLoc();
      });
  }

  // function, that accept user image and call function redraw image
  resizeImage() {
    const file = (<HTMLInputElement>document.getElementById('imageFile'))
      .files[0];
    const fr = new FileReader();
    fr.readAsDataURL(file);
    const inputImageData = new Promise(function(resolve, reject) {
      fr.onload = () => resolve(fr.result);
    });
    inputImageData.then(data => {
      // calling this function draw big image
      this.reDrawImage(data, 1200, 800);
      // calling this function draw small image, that used for preview
      this.reDrawImage(data, 200, 100);
    });
  }

  // function, that change image resolution. this is temp realization on canvas, its not very effective
  // arguments accept input image, max width, max height
  reDrawImage(data, maxWidth, maxHeight) {
    const image = new Image();
    image.src = data;
    const innerInputImage = new Promise(function(resolve, reject) {
      image.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = (<HTMLImageElement>this).width;
        let height = (<HTMLImageElement>this).height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(<HTMLImageElement>this, 0, 0, width, height);
        const redrawBase64 = canvas.toDataURL('image/png', 0.5);
        const userFile = <HTMLImageElement>document.getElementById('userFile');
        maxWidth < 300 ? (userFile.src = redrawBase64) : (userFile.src = null);
        resolve(redrawBase64);
      };
    });
    innerInputImage.then(redrawBase64 => {
      if (maxWidth < 300) {
        this.userPreviewImage = redrawBase64;
      } else {
        this.userImage = redrawBase64;
      }
    });
  }

  // function, that take away data from form and js. Next step - sent data on firebase realtime database
  onSubmit() {
    // create new variables by de-structuring, from user form data
    const {
      name,
      author,
      type,
      locationType,
      address,
      description
    } = this.userForm.value;
    const object = {
      type: 'Feature',
      properties: {
        name,
        author,
        type,
        locationType,
        address,
        image: '',
        description
      },
      geometry: {
        type: 'Point',
        coordinates: this.exportCoord.split(',')
      }
    };
    // get new key of future object
    const key = firebase
      .database()
      .ref('objects/')
      .push().key;
    const objects = {};
    objects['objects/' + key] = object;
    // send image to firebase storage
    this.storage.uploadImages(this.userImage.split(',')[1], key, 'imageFull');
    this.storage.uploadImages(
      this.userPreviewImage.split(',')[1],
      key,
      'imagePreview'
    );
    // send data to firebase realtime database
    firebase
      .database()
      .ref()
      .update(objects)
      .then(() => {
        this.activeModal.close();
      });
  }
  getCurrLoc() {
    const lat = this.myMarker._latlng.lat.toFixed(6);
    const lng = this.myMarker._latlng.lng.toFixed(6);
    this.exportCoord = lat + ',' + lng;
  }
}
