import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  active: string; // value, which given from mainComponent to galleryComponent. there set value of start slide
  constructor() {}

  // function, which set value of active
  setActive(i) {
    this.active = i;
  }
}
