import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {}

  arrayBI = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6', 'bg7', 'bg8'];
  backImage = 'bg8';
  backImageIndex = 0;
  timer = setInterval(() => {
    if (this.backImageIndex < this.arrayBI.length) {
      this.backImage = this.arrayBI[this.backImageIndex];
      this.backImageIndex++;
    } else {
      this.backImageIndex = 0;
      this.backImage = this.arrayBI[this.backImageIndex];
    }
    return this.backImage;
  }, 5000);

  ngOnInit() {}

}
