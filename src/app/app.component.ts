import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor() {}
  ngOnInit() {
    const config = {
      apiKey: 'AIzaSyAf2IW0XdvJ6case5VqidJwOIOiWwOWNTc',
      authDomain: 'citywalls-b90e3.firebaseapp.com',
      databaseURL: 'https://citywalls-b90e3.firebaseio.com',
      projectId: 'citywalls-b90e3',
      storageBucket: 'citywalls-b90e3.appspot.com',
      messagingSenderId: '693647528029'
    };
    firebase.initializeApp(config);
  }
}
