import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
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
    const config = environment.firebaseConfig;
    firebase.initializeApp(config);
  }
}
