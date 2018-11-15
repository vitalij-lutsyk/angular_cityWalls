import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { UserObj } from './userObj';
@Injectable({
  providedIn: 'root'
})
export class DbService {
  objRef = firebase.database().ref('objects');
  objects: UserObj[];
  newObject = new Subject<UserObj[]>();

  constructor() {}

  // fetching data from firebase
  fetchData() {
    this.objRef.on('value', snap => {
      const list: Array<any> = snap.val();
      const arr: Array<any> = [];
      if (list) {
        const keys = Object.keys(list);
        for (const key of keys) {
          arr.push({
            id: key,
            geometry: list[key].geometry,
            properties: list[key].properties,
            type: list[key].type
          });
        }
      }
      this.objects = arr;
      this.newObject.next(this.objects);
    });
  }
}
