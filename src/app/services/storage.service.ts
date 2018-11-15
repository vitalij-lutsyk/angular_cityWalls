import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  // function, that send image to firebase storage, and getting back link, and write this link in realtime database
  // in first argument accepting image, second - object id, third - name(imageFull or imagePreviews)
  uploadImages(img, key, name) {
    if (img) {
      const date = new Date().getTime();
      const ref = firebase.storage().ref(`${name}/image${date}`);
      ref.putString(img, 'base64').on(
        'state_changed',
        () => {},
        () => {},
        () => {
          ref.getDownloadURL().then(url => {
            const objects = {};
            objects['objects/' + key + '/properties/' + name] = url;
            firebase
              .database()
              .ref()
              .update(objects);
          });
        }
      );
    }
  }
}
